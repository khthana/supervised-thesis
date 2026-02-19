import 'package:wellwave_frontend/features/leaderboard/data/models/leaderboard_request_model.dart';

class LeaderBoardState {
  LeaderBoardState();
}

class LeaderBoardInitial extends LeaderBoardState {}

class LeaderBoardLoading extends LeaderBoardState {}

class LeaderBoardLoaded extends LeaderBoardState {
  final LeaderboardRequestModel userBoard;

  LeaderBoardLoaded(this.userBoard);
}

class LeaderBoardError extends LeaderBoardState {
  final String errorMessage;
  LeaderBoardError(this.errorMessage);
}
