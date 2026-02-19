import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final ProfileRepositories profileRepositories;

  ProfileBloc({required this.profileRepositories})
      : super(const ProfileInitial()) {
    on<FetchUserProfile>(_onFetchUserProfile);
    on<EditUserProfile>(_onEditUserProfile);
    on<EditUserGoalPerWeek>(_onEditUserGoalPerWeek);
    on<ImagePicked>(_onImagePicked);
    on<UpdateProfileImage>(_onUpdateProfileImage);
    on<CreateCheckInEvent>(_onCreateCheckInResponse);
  }

  Future<void> _onFetchUserProfile(
    FetchUserProfile event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading(selectedImage: state.selectedImage));
    try {
      final userProfile = await profileRepositories.getUSer();
      if (userProfile == null) {
        emit(ProfileError('User profile not found',
            selectedImage: state.selectedImage));
      } else {
        emit(ProfileLoaded(userProfile, selectedImage: state.selectedImage));
      }
    } catch (e) {
      emit(ProfileError(e.toString(), selectedImage: state.selectedImage));
    }
  }

  Future<void> _onEditUserProfile(
    EditUserProfile event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading(selectedImage: state.selectedImage));
    try {
      final userProfile = await profileRepositories.getUSer();
      if (userProfile == null) {
        emit(ProfileError('User profile not found',
            selectedImage: state.selectedImage));
        return;
      }

      final updatedImageUrl = event.imageUrl ?? userProfile.imageUrl;
      final isEdited = await profileRepositories.editUserRequest(
        uid: userProfile.uid,
        imageUrl: updatedImageUrl,
        username: event.username,
        yearOfBirth: event.yearOfBirth,
        gender: event.gender,
        height: event.height,
        weight: event.weight,
        gem: event.gem,
      );

      if (isEdited) {
        final updatedUserProfile = await profileRepositories.getUSer();
        if (updatedUserProfile != null) {
          emit(ProfileLoaded(updatedUserProfile,
              selectedImage: state.selectedImage));
        } else {
          emit(ProfileError('Failed to fetch updated profile',
              selectedImage: state.selectedImage));
        }
      } else {
        emit(ProfileError('Failed to edit profile',
            selectedImage: state.selectedImage));
      }
    } catch (e) {
      emit(ProfileError(e.toString(), selectedImage: state.selectedImage));
    }
  }

  Future<void> _onEditUserGoalPerWeek(
    EditUserGoalPerWeek event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading(selectedImage: state.selectedImage));
    try {
      final userProfile = await profileRepositories.getUSer();
      if (userProfile == null) {
        emit(ProfileError('User profile not found',
            selectedImage: state.selectedImage));
        return;
      }

      final isEdited = await profileRepositories.setGoalPerWeek(
        uid: userProfile.uid,
        stepPerWeek: event.stepPerWeek,
        exercisePerWeek: event.exercisePerWeek,
      );

      if (isEdited) {
        final userProfile = await profileRepositories.getUSer();
        if (userProfile == null) {
          emit(ProfileError('User profile not found',
              selectedImage: state.selectedImage));
        } else {
          emit(ProfileLoaded(userProfile, selectedImage: state.selectedImage));
        }
      } else {
        emit(ProfileError('Failed to edit user goal per week',
            selectedImage: state.selectedImage));
      }
    } catch (e) {
      emit(ProfileError(e.toString(), selectedImage: state.selectedImage));
    }
  }

  Future<void> _onImagePicked(
    ImagePicked event,
    Emitter<ProfileState> emit,
  ) async {
    try {
      emit(ProfileLoading(selectedImage: event.imageFile));
      debugPrint('Processing ImagePicked event');
      debugPrint('Image file path: ${event.imageFile.path}');

      final userProfile = await profileRepositories.getUSer();
      if (userProfile == null) {
        throw Exception('User profile not found');
      }

      debugPrint('Uploading image for UID: ${userProfile.uid}');
      final imageUrl = await profileRepositories.uploadProfileImage(
        event.imageFile,
        userProfile.uid,
      );

      if (imageUrl == null) {
        throw Exception('Failed to get image URL from server');
      }

      debugPrint('Successfully got image URL: $imageUrl');
      final updatedUserProfile = userProfile.copyWith(imageUrl: imageUrl);
      emit(ProfileLoaded(updatedUserProfile, selectedImage: event.imageFile));
    } catch (e, stackTrace) {
      debugPrint('Error in ImagePicked event handler: $e');
      debugPrint('Stack trace: $stackTrace');
      emit(ProfileError(e.toString(), selectedImage: state.selectedImage));
    }
  }

  Future<void> _onUpdateProfileImage(
    UpdateProfileImage event,
    Emitter<ProfileState> emit,
  ) async {
    if (state is ProfileLoaded) {
      final currentState = state as ProfileLoaded;
      emit(currentState.copyWith(selectedImage: event.imageFile));
      add(ImagePicked(event.imageFile));
    }
  }

  Future<void> _onCreateCheckInResponse(
    CreateCheckInEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading(selectedImage: state.selectedImage));
    try {
      final isCheckInSuccessful =
          await profileRepositories.createCheckInResponse(
        date: event.date,
      );

      if (isCheckInSuccessful) {
        final userProfile = await profileRepositories.getUSer();
        if (userProfile == null) {
          emit(ProfileError('User profile not found',
              selectedImage: state.selectedImage));
        } else {
          emit(ProfileLoaded(userProfile, selectedImage: state.selectedImage));
        }
      } else {
        emit(ProfileError('Failed to check in',
            selectedImage: state.selectedImage));
      }
    } catch (e) {
      debugPrint('Error in CreateCheckInResponse event: $e');
      emit(ProfileError(e.toString(), selectedImage: state.selectedImage));
    }
  }
}
