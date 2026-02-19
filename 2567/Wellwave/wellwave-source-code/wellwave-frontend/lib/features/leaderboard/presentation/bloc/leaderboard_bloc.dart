import 'package:bloc/bloc.dart';
import 'package:wellwave_frontend/features/leaderboard/data/repositories/leaderboard_repositories.dart';
import 'package:wellwave_frontend/features/leaderboard/presentation/bloc/leaderboard_state.dart';

import 'leaderboard_event.dart';

class LeaderBoardBloc extends Bloc<LeaderBoardEvent, LeaderBoardState> {
  final LeaderboardRepositories leaderBoardRepositories;

  LeaderBoardBloc({required this.leaderBoardRepositories})
      : super(LeaderBoardInitial()) {
    // Fetch user leaderBoard
    on<FetchUserBoard>((event, emit) async {
      emit(LeaderBoardLoading());
      try {
        final userLeaderBoard = await leaderBoardRepositories.getUserBoard();
        if (userLeaderBoard == null) {
          emit(LeaderBoardError('User leaderBoard not found fetch'));
        } else {
          emit(LeaderBoardLoaded(userLeaderBoard));
        }
      } catch (e) {
        emit(LeaderBoardError(e.toString()));
      }
    });
  }
}
