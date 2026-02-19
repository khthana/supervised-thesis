import 'dart:io';
import 'package:equatable/equatable.dart';
import 'package:wellwave_frontend/features/profile/data/models/profile_request_model.dart';

abstract class ProfileState extends Equatable {
  final File? selectedImage;

  const ProfileState({this.selectedImage});

  @override
  List<Object?> get props => [selectedImage];
}

class ProfileInitial extends ProfileState {
  const ProfileInitial() : super(selectedImage: null);
}

class ProfileLoading extends ProfileState {
  const ProfileLoading({File? selectedImage})
      : super(selectedImage: selectedImage);
}

class ProfileLoaded extends ProfileState {
  final ProfileRequestModel userProfile;

  const ProfileLoaded(this.userProfile, {File? selectedImage})
      : super(selectedImage: selectedImage);

  @override
  List<Object?> get props => [userProfile, selectedImage];

  ProfileLoaded copyWith({
    ProfileRequestModel? userProfile,
    File? selectedImage,
  }) {
    return ProfileLoaded(
      userProfile ?? this.userProfile,
      selectedImage: selectedImage ?? this.selectedImage,
    );
  }
}

class ProfileEdited extends ProfileState {
  const ProfileEdited({File? selectedImage})
      : super(selectedImage: selectedImage);
}

class ProfileError extends ProfileState {
  final String errorMessage;

  const ProfileError(this.errorMessage, {File? selectedImage})
      : super(selectedImage: selectedImage);

  @override
  List<Object?> get props => [errorMessage, selectedImage];
}

class CheckInSuccess extends ProfileState {
  const CheckInSuccess({File? selectedImage})
      : super(selectedImage: selectedImage);
}
