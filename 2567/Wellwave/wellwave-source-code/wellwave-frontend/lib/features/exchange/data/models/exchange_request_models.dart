class ExchangeRequestModels {
  final int userItemId;
  final int uid;
  final int itemId;
  final DateTime purchaseDate;
  final DateTime? expireDate;
  final bool isActive;
  final Item item;

  const ExchangeRequestModels({
    required this.userItemId,
    required this.uid,
    required this.itemId,
    required this.purchaseDate,
    this.expireDate,
    required this.isActive,
    required this.item,
  });

  factory ExchangeRequestModels.fromJson(Map<String, dynamic> json) {
    return ExchangeRequestModels(
      userItemId: json['USER_ITEM_ID'],
      uid: json['UID'],
      itemId: json['ITEM_ID'],
      purchaseDate: DateTime.parse(json['PURCHASE_DATE']),
      expireDate: json['EXPIRE_DATE'] != null
          ? DateTime.tryParse(json['EXPIRE_DATE'])
          : null,
      isActive: json['IS_ACTIVE'],
      item: Item.fromJson(json['item']),
    );
  }
}

class Item {
  final int itemId;
  final String itemType;
  final String itemName;
  final String description;
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
    required this.itemName,
    required this.description,
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
    return Item(
      itemId: json['ITEM_ID'],
      itemType: json['ITEM_TYPE'],
      itemName: json['ITEM_NAME'],
      description: json['DESCRIPTION'],
      priceGem: json['PRICE_GEM'],
      priceExp: json['PRICE_EXP'],
      imageUrl: json['IMAGE_URL'],
      rarity: (json['RARITY'] as num).toDouble(),
      isActive: json['IS_ACTIVE'],
      expBooster: json['expBooster'] != null
          ? ExpBooster.fromJson(json['expBooster'])
          : null,
      gemExchange: json['gemExchange'] != null
          ? GemExchange.fromJson(json['gemExchange'])
          : null,
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
      itemId: json['ITEM_ID'],
      boostMultiplier: (json['BOOST_MULTIPLIER'] as num).toDouble(),
      boostDays: json['BOOST_DAYS'],
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
      itemId: json['ITEM_ID'],
      gemReward: json['GEM_REWARD'],
    );
  }
}

class MysteryBox {
  final String boxName;
  final String boxDescription;
  final int priceGem;
  final int priceExp;
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
      boxName: json['BOX_NAME'],
      boxDescription: json['BOX_DESCRIPTION'],
      priceGem: json['PRICE_GEM'],
      priceExp: json['PRICE_EXP'],
      imageUrl: json['IMAGE_URL'],
      isActive: json['IS_ACTIVE'],
    );
  }
}
