import 'package:wellwave_frontend/features/exchange/data/models/exchange_response_models.dart';

abstract class ExchangeState {
  const ExchangeState();
}

class ExchangeInitial extends ExchangeState {
  const ExchangeInitial() : super();
}

class ExchangeLoading extends ExchangeState {
  const ExchangeLoading() : super();
}

class ExchangeLoaded extends ExchangeState {
  final ExchangeResponseModels userExchange;

  const ExchangeLoaded(this.userExchange) : super();

  ExchangeLoaded copyWith({
    ExchangeResponseModels? userExchange,
  }) {
    return ExchangeLoaded(
      userExchange ?? this.userExchange,
    );
  }
}

class ExchangeUserItemLoading extends ExchangeState {
  const ExchangeUserItemLoading() : super();
}

class ExchangeUserItemLoaded extends ExchangeState {
  final ExchangeResponseModels userExchange;

  const ExchangeUserItemLoaded(this.userExchange) : super();

  ExchangeUserItemLoaded copyWith({
    ExchangeResponseModels? userExchange,
  }) {
    return ExchangeUserItemLoaded(
      userExchange ?? this.userExchange,
    );
  }
}

class ExchangeError extends ExchangeState {
  final String errorMessage;

  const ExchangeError(this.errorMessage) : super();
}

class MysteryBoxLoading extends ExchangeState {
  const MysteryBoxLoading() : super();
}

class MysteryBoxOpened extends ExchangeState {
  final String itemName;
  final String description;
  final String itemType;
  final int userItemId;
  final double? boostMultiplier;
  final int? gemReward;
  final int? boostDays;
  final ExchangeResponseModels? previousExchangeItems;

  const MysteryBoxOpened(this.itemName, this.description, this.itemType,
      this.userItemId, this.boostMultiplier, this.gemReward, this.boostDays,
      {this.previousExchangeItems});
}
