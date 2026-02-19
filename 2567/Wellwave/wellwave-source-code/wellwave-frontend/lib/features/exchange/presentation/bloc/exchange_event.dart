import '../../data/models/exchange_response_models.dart';

abstract class ExchangeEvent {}

class FetchUserItemEvent extends ExchangeEvent {}

class FetchAllItemEvent extends ExchangeEvent {}

class BuyItemEvent extends ExchangeEvent {
  final int itemId;

  BuyItemEvent({required this.itemId});
}

class OpenMysteryBoxEvent extends ExchangeEvent {
  OpenMysteryBoxEvent();
}

class ActiveItemEvent extends ExchangeEvent {
  final int userItemId;

  ActiveItemEvent(this.userItemId);
}

class RestoreExchangeItemsEvent extends ExchangeEvent {
  final ExchangeResponseModels items;

  RestoreExchangeItemsEvent(this.items);
}
