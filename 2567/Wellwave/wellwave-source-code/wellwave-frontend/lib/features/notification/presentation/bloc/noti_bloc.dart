import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

import '../../data/models/drink_plan_notification_response_model.dart';
import '../../data/models/mission_notification_request_model.dart';
import '../../data/repositories/notification_repositories.dart';
part 'noti_state.dart';
part 'noti_event.dart';

class NotiBloc extends Bloc<NotiEvent, NotiState> {
  final NotificationSettingRepository _notificationSettingRepository;

  NotiBloc(this._notificationSettingRepository) : super(NotiInitial()) {
    on<CreateBedtimeEvent>(_onCreateBedtimeEvent);
    on<UpdateBedtimeEvent>(_onUpdateBedtimeEvent);
    on<FetchBedtimeEvent>(_onFetchBedtimeEvent);

    on<CreateDrinkPlanEvent>(_onCreateDrinkPlanEvent);
    on<FetchDrinkPlanEvent>(_onFetchDrinkPlanEvent);
    on<UpdateDrinkPlanEvent>(_onUpdateDrinkPlanEvent);

    on<CreateDrinkRangeEvent>(_onCreateDrinkRangeEvent);
    on<FetchDrinkRangeEvent>(_onFetchDrinkRangeEvent);
    on<UpdateDrinkRangeEvent>(_onUpdateDrinkRangeEvent);

    on<FetchMissionEvent>(_onFetchMissionEvent);
    on<ToggleAllMissionsEvent>(_onToggleAllMissionsEvent);
    on<CreateMissionEvent>(_onCreateMissionEvent);
    on<UpdateMissionEvent>(_onUpdateMissionEvent);
  }

  Future<void> _onCreateBedtimeEvent(
      CreateBedtimeEvent event, Emitter<NotiState> emit) async {
    try {
      await createBedTime(
          event.uid, event.isActive, event.bedtime, event.weekdays);

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(
          bedtimeState: BedtimeState(
            isActive: event.isActive,
            bedtime: event.bedtime,
            weekdays: event.weekdays,
          ),
        ));
      } else {
        emit(NotiLoadedState(
          bedtimeState: BedtimeState(
            isActive: event.isActive,
            bedtime: event.bedtime,
            weekdays: event.weekdays,
          ),
        ));
      }
    } catch (error) {
      debugPrint('Error creating bedtime: $error');
    }
  }

  Future<void> _onUpdateBedtimeEvent(
      UpdateBedtimeEvent event, Emitter<NotiState> emit) async {
    try {
      await updateBedTime(
          event.uid, event.isActive, "", _notificationSettingRepository);

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(
          bedtimeState:
              currentState.bedtimeState?.copyWith(isActive: event.isActive),
        ));
      } else {
        emit(NotiLoadedState(
          bedtimeState: BedtimeState(
            isActive: event.isActive,
            bedtime: "",
            weekdays: {},
          ),
        ));
      }
    } catch (error) {
      debugPrint('Error updating bedtime: $error');
    }
  }

  Future<void> _onFetchBedtimeEvent(
      FetchBedtimeEvent event, Emitter<NotiState> emit) async {
    try {
      if (state is! BedtimeState) {
        final fetchedData =
            await _notificationSettingRepository.fetchBedSetting();

        final bedtimeState = BedtimeState(
          isActive: fetchedData!.isActive,
          bedtime: fetchedData.setting.bedtime,
          weekdays: fetchedData.setting.weekdays,
        );

        if (state is NotiLoadedState) {
          emit((state as NotiLoadedState).copyWith(bedtimeState: bedtimeState));
        } else {
          emit(NotiLoadedState(bedtimeState: bedtimeState));
        }
      }
    } catch (error) {
      debugPrint('Error in _onFetchBedtimeEvent: $error');
    }
  }

  Future<void> _onCreateDrinkPlanEvent(
      CreateDrinkPlanEvent event, Emitter<NotiState> emit) async {
    try {
      final newSetting = DrinkSettingDetail(
        uid: event.uid,
        notificationType: 'WATER_PLAN',
        notitime: event.notitime,
        glassNumber: event.glassNumber,
      );

      await createDrinkPlan(
        event.uid,
        event.glassNumber,
        event.notitime,
        _notificationSettingRepository,
      );

      final newDrinkPlanState = DrinkPlanState(
        isActive: true,
        settings: [newSetting],
      );

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(drinkPlanState: newDrinkPlanState));
      } else {
        emit(newDrinkPlanState);
      }

      debugPrint(
          'DrinkPlan created and state updated: isActive = true, settings count = 1');
    } catch (error) {
      debugPrint('Error creating DrinkPlan: $error');
    }
  }

  Future<void> _onFetchDrinkPlanEvent(
      FetchDrinkPlanEvent event, Emitter<NotiState> emit) async {
    try {
      final fetchedData =
          await _notificationSettingRepository.fetchDrinkPlanSetting();

      if (fetchedData != null) {
        debugPrint(
            'bloc Fetched Data: isActive = ${fetchedData.isActive}, settings count = ${fetchedData.setting.length}');

        for (var setting in fetchedData.setting) {
          debugPrint('Setting Detail: ${setting.toJson()}');
        }

        final newDrinkPlanState = DrinkPlanState(
          isActive: fetchedData.isActive,
          settings: fetchedData.setting,
        );

        if (state is NotiLoadedState) {
          final currentState = state as NotiLoadedState;
          emit(currentState.copyWith(drinkPlanState: newDrinkPlanState));
        } else {
          emit(newDrinkPlanState);
        }

        debugPrint(
            'DrinkPlanState emitted with isActive: ${fetchedData.isActive}, settings count = ${fetchedData.setting.length}');
      } else {
        debugPrint('Error: No data fetched or data was null');
      }
    } catch (error) {
      debugPrint('Error fetching drinkPlan: $error');
    }
  }

  Future<void> createBedTime(int uid, bool isActive, String bedTime,
      Map<String, bool> weekdays) async {
    try {
      await _notificationSettingRepository.createBedSetting(
        uid: uid,
        isActive: isActive,
        bedtime: bedTime,
        weekdays: weekdays,
      );
      debugPrint(
          'Bedtime setting created successfully for $uid, $isActive, $bedTime');
    } catch (error) {
      debugPrint('Error submitting log: $error');
    }
  }

  Future<void> updateBedTime(int uid, bool isActive, String bedTime,
      NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.updateBedSetting(
        uid: uid,
        isActive: isActive,
      );
      debugPrint('Bedtime setting updated successfully for $uid, $isActive');
    } catch (error) {
      debugPrint('Error submitting log: $error');
    }
  }

  Future<void> createDrinkPlan(int uid, int glassNumber, String notitime,
      NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.createDrinkPlanSetting(
        uid: uid,
        glassNumber: glassNumber,
        notitime: notitime,
      );
      debugPrint(
          'DrinkPlan setting created successfully for $uid, $notitime, $glassNumber');
    } catch (error) {
      debugPrint('Error submitting DrinkPlan: $error');
    }
  }

  Future<void> _onUpdateDrinkPlanEvent(
      UpdateDrinkPlanEvent event, Emitter<NotiState> emit) async {
    try {
      await updateDrinkPlan(
        event.uid,
        event.isActive,
        _notificationSettingRepository,
      );

      final newDrinkPlanState = DrinkPlanState(
        isActive: event.isActive,
        settings:
            state is DrinkPlanState ? (state as DrinkPlanState).settings : [],
      );

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(drinkPlanState: newDrinkPlanState));
      } else {
        emit(newDrinkPlanState);
      }

      debugPrint('DrinkPlan updated: isActive = ${event.isActive}');
    } catch (error) {
      debugPrint('Error updating DrinkPlan: $error');
    }
  }

  Future<void> updateDrinkPlan(int uid, bool isActive,
      NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.updateDrinkPlanSetting(
        uid: uid,
        isActive: isActive,
      );
      debugPrint('DrinkPlan setting updated successfully for $uid, $isActive');
    } catch (error) {
      debugPrint('Error submitting DrinkPlan: $error');
    }
  }

  Future<void> _onCreateDrinkRangeEvent(
      CreateDrinkRangeEvent event, Emitter<NotiState> emit) async {
    try {
      await createDrinkRange(
        event.uid,
        event.startTime,
        event.endTime,
        event.intervalMinute,
        _notificationSettingRepository,
      );

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(
          drinkRangeState: DrinkRangeState(
            isActive: true,
            startTime: event.startTime,
            endTime: event.endTime,
            intervalMinute: event.intervalMinute,
          ),
        ));
      } else {
        emit(NotiLoadedState(
          drinkRangeState: DrinkRangeState(
            isActive: true,
            startTime: event.startTime,
            endTime: event.endTime,
            intervalMinute: event.intervalMinute,
          ),
        ));
      }
    } catch (error) {
      debugPrint('Error creating DrinkRange: $error');
    }
  }

  Future<void> _onFetchDrinkRangeEvent(
      FetchDrinkRangeEvent event, Emitter<NotiState> emit) async {
    try {
      if (state is! DrinkRangeState) {
        final fetchedData =
            await _notificationSettingRepository.fetchDrinkRangeSetting();

        final drinkRangeState = DrinkRangeState(
          isActive: fetchedData!.isActive,
          startTime: fetchedData.setting.startTime,
          endTime: fetchedData.setting.endTime,
          intervalMinute: fetchedData.setting.intervalMinute,
        );

        if (state is NotiLoadedState) {
          emit((state as NotiLoadedState)
              .copyWith(drinkRangeState: drinkRangeState));
        } else {
          emit(NotiLoadedState(drinkRangeState: drinkRangeState));
        }
      }
    } catch (error) {
      debugPrint('Error fetching drink range: $error');
    }
  }

  Future<void> _onUpdateDrinkRangeEvent(
      UpdateDrinkRangeEvent event, Emitter<NotiState> emit) async {
    try {
      await updateDrinkRange(
          event.uid, event.isActive, "", "", 0, _notificationSettingRepository);

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        emit(currentState.copyWith(
          drinkRangeState:
              currentState.drinkRangeState?.copyWith(isActive: event.isActive),
        ));
      } else {
        emit(NotiLoadedState(
          drinkRangeState: DrinkRangeState(
            isActive: event.isActive,
            startTime: '',
            endTime: '',
            intervalMinute: 0,
          ),
        ));
      }
    } catch (error) {
      debugPrint('Error updating drink range: $error');
    }
  }

  Future<void> createDrinkRange(int uid, String startTime, String endTime,
      int intervalMinute, NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.createDrinkRangeSetting(
        uid: uid,
        startTime: startTime,
        endTime: endTime,
        intervalMinute: intervalMinute,
      );
      debugPrint(
          'DrinkRange setting created successfully for $uid, startTime: $startTime, endTime: $endTime, intervalMinute: $intervalMinute');
    } catch (error) {
      debugPrint('Error creating DrinkRange: $error');
    }
  }

  Future<void> updateDrinkRange(
      int uid,
      bool isActive,
      String startTime,
      String endTime,
      int intervalMinute,
      NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.updateDrinkRangeSetting(
        uid: uid,
        isActive: isActive,
      );
      debugPrint(
          'DrinkRange setting updated successfully for $uid, isActive: $isActive, startTime: $startTime, endTime: $endTime, intervalMinute: $intervalMinute');
    } catch (error) {
      debugPrint('Error updating DrinkRange: $error');
    }
  }

  //mission
  Future<void> _onFetchMissionEvent(
      FetchMissionEvent event, Emitter<NotiState> emit) async {
    try {
      debugPrint('Current state: $state');

      final missions =
          await _notificationSettingRepository.fetchMissionSetting();

      if (missions.isNotEmpty) {
        debugPrint('Fetched ${missions.length} missions:');
        // for (var mission in missions) {
        //   debugPrint('Mission: challengeId = ${mission.challengeId}, '
        //       'title = ${mission.title}, '
        //       'isNotificationEnabled = ${mission.isNotificationEnabled}, '
        //       'weekdaysNoti = ${mission.weekdaysNoti}');
        // }

        final missionState = MissionState(
          missions: missions,
          total: missions.length,
        );

        if (state is NotiLoadedState) {
          emit((state as NotiLoadedState).copyWith(missionState: missionState));
        } else {
          emit(NotiLoadedState(missionState: missionState));
        }
        debugPrint(
            'Emitted new state with ${missions.length} missions'); // Add this debug line
      } else {
        debugPrint('Error: No missions fetched');
        emit(NotiError(message: 'ไม่พบภารกิจ'));
      }
    } catch (error) {
      debugPrint('Error fetching missions: $error');
      emit(NotiError(message: error.toString()));
    }
  }

  Future<void> _onToggleAllMissionsEvent(
      ToggleAllMissionsEvent event, Emitter<NotiState> emit) async {
    if (state is NotiLoadedState) {
      final currentState = state as NotiLoadedState;
      final missions = currentState.missionState?.missions ?? [];

      for (var mission in missions) {
        try {
          await _notificationSettingRepository.updateMissionSetting(
            challengeId: mission.challengeId,
            isNotificationEnabled: event.enableAll,
            notiTime: mission.notiTime,
            weekdaysNoti: mission.weekdaysNoti,
          );
        } catch (error) {
          debugPrint(
              '❌ Failed to update mission ${mission.challengeId}: $error');
          continue; // Continue with other missions even if one fails
        }
      }

      // Update local state after all API calls
      final updatedMissions = missions.map((mission) {
        return mission.copyWith(isNotificationEnabled: event.enableAll);
      }).toList();

      emit(currentState.copyWith(
        missionState:
            currentState.missionState?.copyWith(missions: updatedMissions),
      ));
    }
  }

  Future<void> _onCreateMissionEvent(
      CreateMissionEvent event, Emitter<NotiState> emit) async {
    try {
      // Ensure API call is made
      await createMissionEvent(event.challengeId, event.isNotificationEnabled,
          event.notiTime, event.weekdaysNoti, event.title);

      // Debug log to check if API call was successful
      // debugPrint(
      //     'Mission setting created successfully for ${event.challengeId}, ${event.isNotificationEnabled}, ${event.notiTime}, ${event.weekdaysNoti}');

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;
        final updatedMissions = List<MissionNotificationModel>.from(
            currentState.missionState!.missions);

        // Check if challenge already exists, update or add new
        int index = updatedMissions
            .indexWhere((mission) => mission.challengeId == event.challengeId);
        if (index != -1) {
          updatedMissions[index] = MissionNotificationModel(
            challengeId: event.challengeId,
            notiTime: event.notiTime,
            isNotificationEnabled: event.isNotificationEnabled,
            weekdaysNoti: event.weekdaysNoti,
            title: event.title,
          );
        } else {
          updatedMissions.add(MissionNotificationModel(
            challengeId: event.challengeId,
            notiTime: event.notiTime,
            isNotificationEnabled: event.isNotificationEnabled,
            weekdaysNoti: event.weekdaysNoti,
            title: event.title,
          ));
        }

        emit(currentState.copyWith(
          missionState: MissionState(missions: updatedMissions),
        ));
      } else {
        emit(NotiLoadedState(
          missionState: MissionState(missions: [
            MissionNotificationModel(
              challengeId: event.challengeId,
              notiTime: event.notiTime,
              isNotificationEnabled: event.isNotificationEnabled,
              weekdaysNoti: event.weekdaysNoti,
              title: event.title,
            )
          ]),
        ));
      }
    } catch (error) {
      debugPrint('Error creating mission: $error');
      emit(NotiError(message: error.toString()));
    }
  }

  Future<void> _onUpdateMissionEvent(
      UpdateMissionEvent event, Emitter<NotiState> emit) async {
    try {
      // debugPrint('🔹 Sending API request: challengeId=${event.challengeId}, '
      //     'isNotificationEnabled=${event.isNotificationEnabled}, '
      //     'notiTime=${event.notiTime}, weekdaysNoti=${event.weekdaysNoti}');

      await _notificationSettingRepository.updateMissionSetting(
        challengeId: event.challengeId,
        isNotificationEnabled: event.isNotificationEnabled,
        notiTime: event.notiTime,
        weekdaysNoti: event.weekdaysNoti,
      );

      if (state is NotiLoadedState) {
        final currentState = state as NotiLoadedState;

        final updatedMissions =
            currentState.missionState!.missions.map((mission) {
          if (mission.challengeId == event.challengeId) {
            return mission.copyWith(
              isNotificationEnabled: event.isNotificationEnabled,
              notiTime:
                  event.notiTime.isNotEmpty ? event.notiTime : mission.notiTime,
              weekdaysNoti: event.weekdaysNoti.isNotEmpty
                  ? event.weekdaysNoti
                  : mission.weekdaysNoti,
            );
          }
          return mission;
        }).toList();

        emit(currentState.copyWith(
          missionState:
              currentState.missionState?.copyWith(missions: updatedMissions),
        ));
      }
    } catch (error) {
      debugPrint('❌ Failed to update mission: $error');
      return; // Prevent state update if API call fails
    }
  }

  Future<void> createMissionEvent(int challengeId, bool isNotificationEnabled,
      String notiTime, Map<String, bool> weekdaysNoti, String title) async {
    try {
      await _notificationSettingRepository.createMissionSetting(
        challengeId: challengeId,
        isNotificationEnabled: isNotificationEnabled,
        notiTime: notiTime,
        weekdaysNoti: weekdaysNoti,
        title: title,
      );
      // debugPrint(
      //     'Mission setting created successfully for $challengeId, $isNotificationEnabled, $notiTime, $weekdaysNoti');
    } catch (error) {
      debugPrint('Error submitting log: $error');
    }
  }

  Future<void> updateMissionEvent(
      int challengeId,
      bool isNotificationEnabled,
      String notiTime,
      Map<String, bool> weekdaysNoti,
      NotificationSettingRepository notiRepository) async {
    try {
      await notiRepository.updateMissionSetting(
        challengeId: challengeId,
        isNotificationEnabled: isNotificationEnabled,
        notiTime: notiTime,
        weekdaysNoti: weekdaysNoti,
      );
      // debugPrint(
      //     'Mission setting updated successfully for $challengeId, $isNotificationEnabled');
    } catch (error) {
      debugPrint('Error update mission: $error');
    }
  }
}
