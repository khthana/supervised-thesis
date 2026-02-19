import 'package:equatable/equatable.dart';

abstract class ArcheivementEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class FetchArcheivement extends ArcheivementEvent {}

class FetchAllArcheivement extends ArcheivementEvent {}

class ReadArcheivement extends ArcheivementEvent {
  final int uid;
  final String achId;
  final int level;

  ReadArcheivement({
    required this.uid,
    required this.achId,
    required this.level,
  });

  @override
  List<Object> get props => [uid, achId, level];
}
