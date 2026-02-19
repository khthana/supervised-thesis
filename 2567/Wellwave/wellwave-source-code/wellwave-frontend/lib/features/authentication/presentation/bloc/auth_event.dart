part of 'auth_bloc.dart';

@immutable
abstract class AuthEvent {}

class RequestResetEvent extends AuthEvent {}

class ConfirmCodeEvent extends AuthEvent {}

class ResetPasswordEvent extends AuthEvent {}

class GoBackEvent extends AuthEvent {}

class CheckLoginStatusEvent extends AuthEvent {}

class LogoutEvent extends AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  LoginEvent({required this.email, required this.password});
}

class RegisterEvent extends AuthEvent {
  final String email;
  final String password;

  RegisterEvent({required this.email, required this.password});
}

class AuthInitialEvent extends AuthEvent {}
