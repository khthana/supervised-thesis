import 'package:bloc/bloc.dart';
import 'package:flutter/foundation.dart';

import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';

import 'health_assessment_event.dart';
import 'health_assessment_state.dart';

class HealthAssessmentBloc
    extends Bloc<HealthAssessmentEvent, HealthAssessmentState> {
  final HealthAssessmentRepository _repository;

  HealthAssessmentBloc(this._repository) : super(HealthAssessmentInitial()) {
    on<SubmitPersonalDataEvent>((event, emit) async {
      final model = event.modelPersonaData;

      final success = await _repository.sendHealthAssessmentPersonalData(model);

      if (success) {
        debugPrint('personal data sent successfully');
      } else {
        debugPrint('Failed to send personal data');
      }
    });

    on<SubmitHealthDataEvent>((event, emit) async {
      final model = event.modelHealthData;

      final success = await _repository.sendHealthAssessmentHealthData(model);

      if (success) {
        debugPrint('health data sent successfully');
      } else {
        debugPrint('Failed to send health data');
      }
    });
  }
}
