import 'package:equatable/equatable.dart';

abstract class LeaderBoardEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class FetchUserBoard extends LeaderBoardEvent {}
