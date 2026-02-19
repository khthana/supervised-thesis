import 'package:equatable/equatable.dart';
import 'package:wellwave_frontend/features/friend/data/models/all_friends_request_model.dart';
import 'package:wellwave_frontend/features/friend/data/models/friend_request_model.dart';

abstract class FriendState extends Equatable {
  final String searchId;

  const FriendState({this.searchId = ''});

  @override
  List<Object?> get props => [searchId];
}

class FriendInitial extends FriendState {
  const FriendInitial() : super(searchId: '');
}

class FriendLoading extends FriendState {
  const FriendLoading() : super(searchId: '');
}

class FriendLoaded extends FriendState {
  final FriendRequestModel friends;
  final AllFriendsRequestModel? allFriends;
  final bool isFriend;
  final bool? isWaveActive;

  const FriendLoaded(
    String searchId,
    this.friends,
    this.allFriends, {
    this.isFriend = false,
    this.isWaveActive,
  }) : super(searchId: searchId);

  @override
  List<Object?> get props =>
      [searchId, friends, isFriend, allFriends, isWaveActive];
}

class FriendError extends FriendState {
  final String message;

  const FriendError(this.message) : super(searchId: '');

  @override
  List<Object?> get props => [searchId, message];
}
