import 'package:equatable/equatable.dart';

sealed class HealthAssessmentState extends Equatable {
  const HealthAssessmentState();

  @override
  List<Object> get props => [];
}

final class HealthAssessmentInitial extends HealthAssessmentState {}
