import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/exchange/data/repositories/exchange_repositories.dart';
import 'package:wellwave_frontend/features/exchange/presentation/bloc/exchange_state.dart';

import '../../data/models/exchange_request_models.dart';
import '../../data/models/exchange_response_models.dart';
import 'exchange_event.dart';

class ExchangeBloc extends Bloc<ExchangeEvent, ExchangeState> {
  final ExchangeRepositories exchangeRepositories;

  ExchangeBloc({required this.exchangeRepositories})
      : super(const ExchangeInitial()) {
    on<FetchUserItemEvent>(_onFetchUserItem);
    on<FetchAllItemEvent>(_onFetchAllItem);
    on<BuyItemEvent>(_onBuyItem);
    on<OpenMysteryBoxEvent>(_onOpenMysteryBox);
    on<ActiveItemEvent>(_onActiveItem);
    // on<RestoreExchangeItemsEvent>(_onRestoreExchangeItems);
  }

  Future<void> _onFetchUserItem(
    FetchUserItemEvent event,
    Emitter<ExchangeState> emit,
  ) async {
    emit(const ExchangeUserItemLoading());
    try {
      final userExchange = await exchangeRepositories.getUserItem();

      // debugPrint("UserExchange Data: $userExchange");

      if (userExchange == null || userExchange.items.isEmpty) {
        debugPrint("No user items found.");
        emit(const ExchangeError('ไม่พบไอเทม'));
        return;
      }

      // debugPrint("Fetched \${userExchange.items.length} items.");
      emit(ExchangeUserItemLoaded(userExchange));
    } catch (e) {
      debugPrint("Error fetching user items: \${e.toString()}");
      emit(const ExchangeError('Error: \${e.toString()}'));
    }
  }

  Future<void> _onFetchAllItem(
    FetchAllItemEvent event,
    Emitter<ExchangeState> emit,
  ) async {
    emit(const ExchangeLoading());
    // debugPrint("Fetching all exchange items...");

    try {
      final userExchange = await exchangeRepositories.getAllItem();

      // debugPrint("UserExchange Data: $userExchange");

      if (userExchange == null || userExchange.items.isEmpty) {
        // debugPrint("No exchange items found.");
        emit(const ExchangeError(AppStrings.noExchangeItemFound));
        return;
      }

      // debugPrint("Fetched \${userExchange.items.length} items.");
      emit(ExchangeLoaded(userExchange));
    } catch (e) {
      debugPrint("Error fetching items: \${e.toString()}");
      emit(const ExchangeError('Error: \${e.toString()}'));
    }
  }

  Future _onBuyItem(
    BuyItemEvent event,
    Emitter emit,
  ) async {
    // Store the current state to preserve exchange items during the transaction
    final currentState = state;
    final ExchangeLoaded? loadedState =
        currentState is ExchangeLoaded ? currentState : null;

    // Only emit loading if we don't have previous items to show
    if (loadedState == null) {
      emit(const ExchangeLoading());
    }

    try {
      final result = await exchangeRepositories.buyItem(
        itemId: event.itemId,
      );

      // Properly handle the Map type conversion
      if (result is Map) {
        // Convert Map<dynamic, dynamic> to Map<String, dynamic>
        final Map<String, dynamic> typedResult = {};
        result.forEach((key, value) {
          typedResult[key.toString()] = value;
        });

        final exchangeRequest = ExchangeResponseModels.fromJson(typedResult);
        emit(ExchangeLoaded(exchangeRequest));
      } else {
        // If result is not a Map (like when it returns false)
        if (loadedState != null) {
          // Restore previous state if we had one
          emit(loadedState);
        } else {
          emit(const ExchangeError('Error buying item'));
        }
      }
    } catch (e) {
      if (loadedState != null) {
        // Restore previous state if we had one
        emit(loadedState);
      } else {
        emit(ExchangeError('Error buying item: ${e.toString()}'));
      }
    }
  }

  Future<void> _onOpenMysteryBox(
    OpenMysteryBoxEvent event,
    Emitter<ExchangeState> emit,
  ) async {
    // Store current exchange items
    ExchangeResponseModels? currentItems;
    if (state is ExchangeLoaded) {
      currentItems = (state as ExchangeLoaded).userExchange;
    }

    emit(const MysteryBoxLoading());

    try {
      final result = await exchangeRepositories.openMysteryBox(
        boxName: 'mainBox',
      );

      debugPrint('Mystery box result: $result');

      if (result is Map<String, dynamic>) {
        final data = result;
        final item = data['item'] ?? {};

        emit(MysteryBoxOpened(
          item['ITEM_NAME'] ?? '', // Handle null by providing empty string
          item['DESCRIPTION'] ?? '', // Handle null by providing empty string
          item['ITEM_TYPE'] ?? '',
          data['USER_ITEM_ID'] ?? 0,
          item['expBooster']?['BOOST_MULTIPLIER']?.toDouble(),
          item['gemExchange']?['GEM_REWARD'],
          item['expBooster']?['BOOST_DAYS'],
          previousExchangeItems: currentItems,
        ));

        debugPrint('Emitted MysteryBoxOpened state');
      } else {
        throw Exception('Invalid response format');
      }
    } catch (e) {
      debugPrint('Error in _onOpenMysteryBox: $e');
      emit(ExchangeError(e.toString()));
    }
  }

  Future _onActiveItem(ActiveItemEvent event, Emitter emit) async {
    emit(const ExchangeUserItemLoading());

    try {
      await exchangeRepositories.activeItem(
        userItemId: event.userItemId,
      );

      final exchangeRequest = await exchangeRepositories.getUserItem();

      if (exchangeRequest != null) {
        emit(ExchangeUserItemLoaded(exchangeRequest));
      } else {
        emit(const ExchangeError('Failed to load user items after activation'));
      }
    } catch (e) {
      emit(ExchangeError('Error: ${e.toString()}'));
    }
  }
}
