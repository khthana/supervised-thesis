import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/models/auth_model.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  final _secureStorage = const FlutterSecureStorage();
  static const _tokenKey = 'access_token';
  AuthBloc({required this.authRepository}) : super(RequestResetState()) {
    on<CheckLoginStatusEvent>(_onCheckLoginStatus);
    on<LoginEvent>(_onLogin);
    on<RegisterEvent>(_onRegister);
    on<LogoutEvent>(_onLogout);

    on<RequestResetEvent>((event, emit) {
      emit(RequestResetState());
    });

    on<ConfirmCodeEvent>((event, emit) {
      emit(ConfirmCodeState());
    });

    on<ResetPasswordEvent>((event, emit) {
      emit(ResetPasswordState());
    });

    on<GoBackEvent>((event, emit) {
      if (state is ConfirmCodeState) {
        emit(RequestResetState());
      } else if (state is ResetPasswordState) {
        emit(ConfirmCodeState());
      }
    });
  }

  Future<void> _onRegister(RegisterEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final isRegistered = await authRepository.register(
        AuthModel(email: event.email, password: event.password),
      );

      if (isRegistered) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('isLoggedIn', true);

        emit(AuthSuccess(message: "Registration successful", statusCode: 201));
        emit(Authenticated());
      } else {
        emit(AuthFailure(message: "Registration failed", statusCode: 401));
      }
    } catch (e) {
      emit(AuthFailure(message: e.toString(), statusCode: 500));
    }
  }

  Future<void> _onLogin(LoginEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final isLoggedIn = await authRepository.login(
        AuthModel(email: event.email, password: event.password),
      );

      if (isLoggedIn) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('isLoggedIn', true);

        final responseData = authRepository.getLoginResponse();
        if (responseData != null &&
            responseData['accessToken'] != null &&
            responseData['user'] != null) {
          final token = responseData['accessToken'];
          final uid = responseData['user']['UID'].toString();

          await _secureStorage.write(key: _tokenKey, value: token);
          await _secureStorage.write(key: 'user_uid', value: uid);

          debugPrint('Token saved: $token');
          debugPrint('User UID saved: $uid');
        } else {
          debugPrint('No token or user data found in response');
        }

        emit(AuthSuccess(message: "Login successful", statusCode: 201));
        emit(Authenticated());
      } else {
        emit(
            AuthFailure(message: "Invalid email or password", statusCode: 401));
      }
    } catch (e) {
      emit(AuthFailure(message: e.toString(), statusCode: 500));
    }
  }

  Future<void> _onCheckLoginStatus(
      CheckLoginStatusEvent event, Emitter<AuthState> emit) async {
    final token = await _secureStorage.read(key: _tokenKey);
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;

    debugPrint('Token from Secure Storage: $token');
    debugPrint('isLoggedIn from SharedPreferences: $isLoggedIn');

    if (isLoggedIn && token != null) {
      emit(Authenticated());
    } else {
      await _secureStorage.delete(key: _tokenKey);
      await prefs.setBool('isLoggedIn', false);
      emit(Unauthenticated());
    }
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<AuthState> emit) async {
    await _secureStorage.delete(key: _tokenKey);
    await _secureStorage.delete(key: 'user_uid');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', false);
    debugPrint(('User logged out, all data cleared.'));
    emit(Unauthenticated());
  }
}
