import '../../../data/models/all_archeivement_request_model.dart';
import '../../../data/models/archeivement_request_model.dart';

abstract class ArcheivementState {}

class ArcheivementInitial extends ArcheivementState {}

class ArcheivementLoading extends ArcheivementState {}

class ArcheivementLoaded extends ArcheivementState {
  final List<ArcheivementRequestModel> achievements;

  ArcheivementLoaded(this.achievements);
}

class AllArcheivementLoaded extends ArcheivementState {
  final List<AllArcheivementRequestModel> allAchievements;
  final List<ArcheivementRequestModel> earnedAchievements;

  AllArcheivementLoaded({
    required this.allAchievements,
    required this.earnedAchievements,
  });
}

class ArcheivementError extends ArcheivementState {
  final String message;

  ArcheivementError(this.message);
}

class ArcheivementReadSuccess extends ArcheivementState {
  final List<ArcheivementRequestModel> achievements;

  ArcheivementReadSuccess(this.achievements);
}
