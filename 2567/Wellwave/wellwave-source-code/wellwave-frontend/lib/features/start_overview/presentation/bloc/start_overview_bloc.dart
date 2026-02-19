import 'package:bloc/bloc.dart';
part 'start_overview_event.dart';
part 'start_overview_state.dart';

class StartRecommendBloc
    extends Bloc<StartRecommendEvent, StartRecommendState> {
  final int totalPages;

  StartRecommendBloc({required this.totalPages})
      : super(StartRecommendState(0)) {
    on<NextPageEvent>((event, emit) {
      if (state.currentIndex < totalPages - 1) {
        emit(StartRecommendState(state.currentIndex + 1));
      }
    });

    on<PreviousPageEvent>((event, emit) {
      if (state.currentIndex > 0) {
        emit(StartRecommendState(state.currentIndex - 1));
      }
    });
  }
}
