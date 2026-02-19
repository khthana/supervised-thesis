part of 'auth_bloc.dart';

@immutable
abstract class AuthState {}

class RequestResetState extends AuthState {}

class ConfirmCodeState extends AuthState {}

class ResetPasswordState extends AuthState {}

class AuthInitial extends AuthState {}

class Authenticated extends AuthState {}

class Unauthenticated extends AuthState {}

class AuthSuccess extends AuthState {
  final String message;
  final int statusCode; // Add the statusCode here

  AuthSuccess({
    required this.message,
    required this.statusCode,
  });

  List<Object> get props =>
      [message, statusCode]; // Add statusCode to props if using equatable
}

class AuthFailure extends AuthState {
  final String message;
  final int statusCode;

  // Constructor to initialize the properties
  AuthFailure({required this.statusCode, required this.message});
}

class AuthLoading extends AuthState {}
