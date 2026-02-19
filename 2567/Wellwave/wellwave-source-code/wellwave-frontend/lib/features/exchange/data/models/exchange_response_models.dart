class ExchangeResponseModels {
  final List<ExchangeResponseModel> items;

  ExchangeResponseModels({required this.items});

  factory ExchangeResponseModels.fromJson(Map<String, dynamic> json) {
    // Handle case where 'items' might not be a list
    if (json['items'] == null) {
      return ExchangeResponseModels(items: []);
    }

    final dynamic itemsList = json['items'];
    if (itemsList is List) {
      return ExchangeResponseModels(
        items: itemsList
            .map((item) =>
                ExchangeResponseModel.fromJson(_ensureStringKeys(item)))
            .toList(),
      );
    }

    // Return empty list if items is not a List
    return ExchangeResponseModels(items: []);
  }

  // Helper method to ensure Map has String keys
  static Map<String, dynamic> _ensureStringKeys(dynamic map) {
    if (map is Map) {
      final Map<String, dynamic> result = {};
      map.forEach((key, value) {
        result[key.toString()] = value;
      });
      return result;
    }
    return {}; // Return empty map if input is not a Map
  }
}

class ExchangeResponseModel {
  final int userItemId;
  final int uid;
  final int itemId;
  final DateTime purchaseDate;
  final DateTime? expireDate;
  final bool isActive;
  final Item item;

  const ExchangeResponseModel({
    required this.userItemId,
    required this.uid,
    required this.itemId,
    required this.purchaseDate,
    this.expireDate,
    required this.isActive,
    required this.item,
  });

  factory ExchangeResponseModel.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> itemData;
    if (json['item'] != null) {
      if (json['item'] is Map) {
        itemData = Map<String, dynamic>.from(json['item']);
      } else {
        itemData = {};
      }
    } else {
      itemData = Map<String, dynamic>.from(json);
    }

    return ExchangeResponseModel(
      userItemId: json['USER_ITEM_ID'] ?? 0,
      uid: json['UID'] ?? 0,
      itemId: json['ITEM_ID'] ?? 0,
      purchaseDate: json['PURCHASE_DATE'] != null
          ? DateTime.parse(json['PURCHASE_DATE'].toString())
          : DateTime.now(),
      expireDate: json['EXPIRE_DATE'] != null
          ? DateTime.parse(json['EXPIRE_DATE'].toString())
          : null,
      isActive: json['IS_ACTIVE'] ?? false,
      item: Item.fromJson(itemData),
    );
  }
}

class Item {
  final int itemId;
  final String itemType;
  final String? itemName;
  final String? description;
  final int priceGem;
  final int priceExp;
  final String? imageUrl;
  final double rarity;
  final bool isActive;
  final ExpBooster? expBooster;
  final GemExchange? gemExchange;
  final List<MysteryBox> mysteryBoxes;

  const Item({
    required this.itemId,
    required this.itemType,
    this.itemName,
    this.description,
    required this.priceGem,
    required this.priceExp,
    this.imageUrl,
    required this.rarity,
    required this.isActive,
    this.expBooster,
    this.gemExchange,
    this.mysteryBoxes = const [],
  });

  factory Item.fromJson(Map<String, dynamic> json) {
// debugPrint('Parsing Item: $json');

    // Debug the expBooster and gemExchange
    // debugPrint('expBooster data: ${json['expBooster']}');
    // debugPrint('gemExchange data: ${json['gemExchange']}');
    // debugPrint('ITEM_TYPE data: ${json['ITEM_TYPE']}');

    final itemType = json['ITEM_TYPE'] ?? '';
    final expBooster = json['expBooster'] != null
        ? ExpBooster.fromJson(json['expBooster'])
        : null;
    final gemExchange = json['gemExchange'] != null
        ? GemExchange.fromJson(json['gemExchange'])
        : null;

// debugPrint(
    // 'Parsed Item - Type: $itemType, ExpBooster: $expBooster, GemExchange: $gemExchange');

    return Item(
      itemId: json['ITEM_ID'] ?? 0,
      itemType: itemType,
      itemName: json['ITEM_NAME'] != null ? json['ITEM_NAME'] : '',
      description: json['DESCRIPTION'] != null ? json['ITEM_NAME'] : '',
      priceGem: json['PRICE_GEM'] ?? 0,
      priceExp: json['PRICE_EXP'] ?? 0,
      imageUrl: json['IMAGE_URL'],
      rarity: (json['RARITY'] as num?)?.toDouble() ?? 0.0,
      isActive: json['IS_ACTIVE'] ?? false,
      expBooster: expBooster,
      gemExchange: gemExchange,
      mysteryBoxes: (json['mysteryBoxes'] as List?)
              ?.map((e) => MysteryBox.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class ExpBooster {
  final int itemId;
  final double boostMultiplier;
  final int boostDays;

  const ExpBooster({
    required this.itemId,
    required this.boostMultiplier,
    required this.boostDays,
  });

  factory ExpBooster.fromJson(Map<String, dynamic> json) {
    return ExpBooster(
      itemId: json['ITEM_ID'] ?? 0,
      boostMultiplier: (json['BOOST_MULTIPLIER'] as num?)?.toDouble() ?? 1.0,
      boostDays: json['BOOST_DAYS'] ?? 0,
    );
  }
}

class GemExchange {
  final int itemId;
  final int gemReward;

  const GemExchange({
    required this.itemId,
    required this.gemReward,
  });

  factory GemExchange.fromJson(Map<String, dynamic> json) {
    return GemExchange(
      itemId: json['ITEM_ID'] ?? 0,
      gemReward: json['GEM_REWARD'] ?? 0,
    );
  }
}

class MysteryBox {
  final String boxName;
  final String boxDescription;
  final int? priceGem;
  final int? priceExp;
  final String? imageUrl;
  final bool isActive;

  const MysteryBox({
    required this.boxName,
    required this.boxDescription,
    required this.priceGem,
    required this.priceExp,
    this.imageUrl,
    required this.isActive,
  });

  factory MysteryBox.fromJson(Map<String, dynamic> json) {
    return MysteryBox(
      boxName: json['BOX_NAME'] ?? 'Unknown',
      boxDescription: json['BOX_DESCRIPTION'] ?? '',
      priceGem: (json['PRICE_GEM'] as int?) ?? 0,
      priceExp: (json['PRICE_EXP'] as int?) ?? 0,
      imageUrl: json['IMAGE_URL'],
      isActive: json['IS_ACTIVE'] ?? false,
    );
  }
}
