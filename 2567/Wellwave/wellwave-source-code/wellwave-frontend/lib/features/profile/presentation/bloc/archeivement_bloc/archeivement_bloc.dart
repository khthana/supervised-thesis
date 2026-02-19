import 'package:bloc/bloc.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/archeivement_repositories.dart';

import 'archeivement_event.dart';
import 'archeivement_state.dart';

class ArcheivementBloc extends Bloc<ArcheivementEvent, ArcheivementState> {
  final ArcheivementRepositories archeivementRepositories;

  ArcheivementBloc({required this.archeivementRepositories})
      : super(ArcheivementInitial()) {
    on<FetchArcheivement>(_onFetchArcheivement);
    on<FetchAllArcheivement>(_onFetchAllArcheivement);
    on<ReadArcheivement>(_onReadArcheivement);
  }

  Future<void> _onFetchArcheivement(
    FetchArcheivement event,
    Emitter<ArcheivementState> emit,
  ) async {
    emit(ArcheivementLoading());
    try {
      final achievements = await archeivementRepositories.getUserArcheivement();
      if (achievements == null) {
        emit(ArcheivementError('Achievements not found'));
      } else {
        emit(ArcheivementLoaded(achievements));
      }
    } catch (e) {
      emit(ArcheivementError(e.toString()));
    }
  }

  Future<void> _onFetchAllArcheivement(
    FetchAllArcheivement event,
    Emitter<ArcheivementState> emit,
  ) async {
    emit(ArcheivementLoading());
    try {
      final allAchievements =
          await archeivementRepositories.getAllArcheivement();
      final earnedAchievements =
          await archeivementRepositories.getUserArcheivement();

      if (allAchievements == null) {
        emit(ArcheivementError('Achievements not found'));
      } else {
        emit(AllArcheivementLoaded(
          allAchievements: allAchievements,
          earnedAchievements: earnedAchievements ?? [],
        ));
      }
    } catch (e) {
      emit(ArcheivementError(e.toString()));
    }
  }

  Future<void> _onReadArcheivement(
    ReadArcheivement event,
    Emitter<ArcheivementState> emit,
  ) async {
    if (state is! ArcheivementLoaded) {
      return; // Ensure we have achievements loaded
    }

    final currentState = state as ArcheivementLoaded;
    emit(ArcheivementLoaded(currentState.achievements)); // Maintain UI state

    try {
      final isSuccess = await archeivementRepositories.readArcheivement(
        uid: event.uid,
        achId: event.achId,
        level: event.level,
      );

      if (isSuccess) {
        final updatedAchievements =
            currentState.achievements.map((achievement) {
          if (achievement.achId == event.achId &&
              achievement.level == event.level) {
            return achievement.copyWith(isRead: true);
          }
          return achievement;
        }).toList();

        emit(ArcheivementLoaded(updatedAchievements));
        emit(ArcheivementReadSuccess(updatedAchievements));
      } else {
        emit(ArcheivementError('Failed to mark achievement as read'));
      }
    } catch (e) {
      emit(ArcheivementError(e.toString()));
    }
  }
}
