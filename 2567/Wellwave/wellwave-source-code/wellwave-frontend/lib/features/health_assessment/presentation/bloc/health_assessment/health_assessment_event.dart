import '../../../data/models/health_assessment_health_data_request_model.dart';
import '../../../data/models/health_assessment_personal_data_request_model.dart';

abstract class HealthAssessmentEvent {}

class SubmitHealthDataEvent extends HealthAssessmentEvent {
  final HealthAssessmentHealthDataRequestModel modelHealthData;

  SubmitHealthDataEvent(this.modelHealthData);
}

class SubmitPersonalDataEvent extends HealthAssessmentEvent {
  final HealthAssessmentPersonalDataRequestModel modelPersonaData;

  SubmitPersonalDataEvent(this.modelPersonaData);
}
