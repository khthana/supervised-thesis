import 'package:equatable/equatable.dart';

abstract class FriendEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class SearchFriendEvent extends FriendEvent {
  final String inputId;
  final String? validId;

  SearchFriendEvent(this.inputId)
      : validId = inputId.startsWith('UID') ? inputId : null;

  @override
  List<Object> get props => [inputId];
}

class ResetEvent extends FriendEvent {}

class ActionFriendProfileEvent extends FriendEvent {}

class ToggleAddfriendButtonEvent extends FriendEvent {
  final String searchId;

  ToggleAddfriendButtonEvent({required this.searchId});
}

class ToggleWaveIconEvent extends FriendEvent {
  final String friendId;

  ToggleWaveIconEvent({required this.friendId});

  @override
  List<Object?> get props => [friendId];
}

class UnfriendButtonEvent extends FriendEvent {
  final String searchId;

  UnfriendButtonEvent({required this.searchId});
}

class FetchFriendProfileEvent extends FriendEvent {
  final int uid;

  FetchFriendProfileEvent({required this.uid});
}

class LoadFriendEvent extends FriendEvent {
  final String friendUid;
  final String selectedPeriod;
  final DateTime? fromDate;
  final DateTime? toDate;

  LoadFriendEvent({
    required this.friendUid,
    required this.selectedPeriod,
    this.fromDate,
    this.toDate,
  });
}

class LoadFriendsEvent extends FriendEvent {}
