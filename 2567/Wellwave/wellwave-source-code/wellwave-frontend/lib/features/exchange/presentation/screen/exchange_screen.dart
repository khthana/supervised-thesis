import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/exchange/presentation/bloc/exchange_bloc.dart';
import 'package:wellwave_frontend/features/exchange/presentation/bloc/exchange_state.dart';
import 'package:wellwave_frontend/features/exchange/presentation/widget/exchange_item_component.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_bloc.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_event.dart';

import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_pages.dart';
import '../../../profile/presentation/bloc/profile_bloc/profile_state.dart';
import '../../../profile/presentation/widget/profile/success_dialog.dart';
import '../bloc/exchange_event.dart';
import '../widget/exp_gem_component.dart';

class ExchangeScreen extends StatelessWidget {
  const ExchangeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    BlocProvider.of<ProfileBloc>(context).add(FetchUserProfile());
    BlocProvider.of<ExchangeBloc>(context).add(FetchAllItemEvent());

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: CustomAppBar(
        context: context,
        onLeading: true,
        backgroundColor: AppColors.transparentColor,
        title: '',
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 44),
          child: Column(
            children: [
              //top
              BlocBuilder<ProfileBloc, ProfileState>(
                builder: (context, state) {
                  if (state is ProfileLoaded) {
                    final profile = state.userProfile;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 9),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ExpGemComponent(
                            imagePath: AppImages.expCoinSvg,
                            value: profile.exp,
                          ),
                          const SizedBox(
                            width: 22,
                          ),
                          ExpGemComponent(
                            imagePath: AppImages.gemSvg,
                            value: profile.gem,
                          ),
                        ],
                      ),
                    );
                  } else if (state is ProfileError) {
                    return Center(child: Text(state.errorMessage));
                  } else if (state is ProfileLoading) {
                    return const Center(child: CircularProgressIndicator());
                  } else {
                    return const Center(
                        child: Text(AppStrings.noDataAvaliableText));
                  }
                },
              ),

              //my item
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    style: ButtonStyle(
                      foregroundColor:
                          WidgetStateProperty.all<Color>(Colors.grey),
                    ),
                    onPressed: () {
                      context.goNamed(AppPages.myItemName);
                    },
                    child: Text(
                      AppStrings.myItemText,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.greyColor,
                            decoration: TextDecoration.underline,
                            decorationColor: AppColors.greyColor,
                          ),
                    ),
                  )
                ],
              ),

              //gachapon
              Padding(
                padding: const EdgeInsets.only(bottom: 36),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          AppStrings.randomBoxText,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(
                                  fontWeight: FontWeight.w700, fontSize: 18),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: BlocBuilder<ProfileBloc, ProfileState>(
                        builder: (context, profileState) {
                          int userGems = 0;

                          if (profileState is ProfileLoaded) {
                            userGems = profileState.userProfile.gem;
                          }
                          final bool canAfford = userGems >= 30;
                          return Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              GestureDetector(
                                  onTap: () {
                                    context
                                        .read<ExchangeBloc>()
                                        .add(OpenMysteryBoxEvent());

                                    Future.delayed(
                                        const Duration(milliseconds: 100), () {
                                      showDialog(
                                        context: context,
                                        barrierDismissible: false,
                                        builder: (BuildContext context) {
                                          return BlocBuilder<ExchangeBloc,
                                              ExchangeState>(
                                            builder: (context, state) {
                                              if (state is MysteryBoxLoading) {
                                                return const Center(
                                                    child:
                                                        CircularProgressIndicator());
                                              } else if (state
                                                  is MysteryBoxOpened) {
                                                return SuccessDialog(
                                                  reward: state.gemReward,
                                                  dayBoostValue:
                                                      state.boostMultiplier,
                                                  dayBoost: state.boostDays,
                                                  iconPath: state.itemType ==
                                                          "exp_boost"
                                                      ? AppImages.boostIcon
                                                      : AppImages.gemIcon,
                                                  onClose: () {
                                                    Navigator.of(context).pop();

                                                    context
                                                        .read<ProfileBloc>()
                                                        .add(
                                                            FetchUserProfile());

                                                    // Restore previous exchange state if available
                                                    if (state
                                                            .previousExchangeItems !=
                                                        null) {
                                                      context
                                                          .read<ExchangeBloc>()
                                                          .add(
                                                              FetchAllItemEvent());
                                                    } else {
                                                      // Fetch if no previous state exists
                                                      context
                                                          .read<ExchangeBloc>()
                                                          .add(
                                                              FetchAllItemEvent());
                                                    }
                                                  },
                                                );
                                              } else if (state
                                                  is ExchangeError) {
                                                return AlertDialog(
                                                  title: const Text("Error"),
                                                  content:
                                                      Text(state.errorMessage),
                                                  actions: [
                                                    TextButton(
                                                      onPressed: () {
                                                        Navigator.of(context)
                                                            .pop();
                                                      },
                                                      child: const Text("OK"),
                                                    ),
                                                  ],
                                                );
                                              } else {
                                                return const Center(
                                                    child:
                                                        CircularProgressIndicator());
                                              }
                                            },
                                          );
                                        },
                                      );
                                    });
                                  },
                                  child: canAfford
                                      ? SvgPicture.asset(AppImages.giftSvg)
                                      : SvgPicture.asset(
                                          AppImages.greyGiftSvg)),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),

              //exchange
              Column(
                children: [
                  Row(
                    children: [
                      Text(
                        AppStrings.exchangeItemText,
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(
                                fontWeight: FontWeight.w700, fontSize: 18),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  BlocBuilder<ExchangeBloc, ExchangeState>(
                    builder: (context, state) {
                      if (state is ExchangeLoading) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (state is ExchangeError) {
                        return Center(
                            child: Column(
                          children: [
                            Image.asset(AppImages.catNoItemimage, height: 128),
                            const SizedBox(height: 32),
                            Text(state.errorMessage),
                          ],
                        ));
                      } else if (state is ExchangeLoaded) {
                        final exchangeItems = state.userExchange.items;

                        return BlocBuilder<ProfileBloc, ProfileState>(
                          builder: (context, profileState) {
                            int userGems = 0;
                            int userExp = 0;

                            if (profileState is ProfileLoaded) {
                              userGems = profileState.userProfile.gem;
                              userExp = profileState.userProfile.exp;
                            }

                            return Wrap(
                              spacing: 16,
                              runSpacing: 16,
                              alignment: WrapAlignment.spaceBetween,
                              children:
                                  exchangeItems.asMap().entries.map((entry) {
                                final int index = entry.key;
                                final exchangeItem = entry.value;

                                final bool canAfford =
                                    exchangeItem.item.itemType == "exp_boost"
                                        ? userGems >= exchangeItem.item.priceGem
                                        : userExp >= exchangeItem.item.priceExp;

                                return ExchangeItemComponent(
                                  itemImagePath:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? AppImages.boostIcon
                                          : AppImages.gemIcon,
                                  requiredImagePath:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? canAfford
                                              ? AppImages.gemIcon
                                              : AppImages.gemNotCheckSvg
                                          : canAfford
                                              ? AppImages.expCoinSvg
                                              : AppImages.greyEXPIcon,
                                  itemValue:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? (exchangeItem.item.expBooster
                                                      ?.boostMultiplier ??
                                                  0.0)
                                              .toDouble()
                                          : (exchangeItem.item.gemExchange
                                                      ?.gemReward ??
                                                  0)
                                              .toDouble(),
                                  dayBoost: exchangeItem.item.itemType ==
                                          "exp_boost"
                                      ? exchangeItem.item.expBooster?.boostDays
                                      : null,
                                  requiredValue:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? exchangeItem.item.priceGem
                                          : exchangeItem.item.priceExp,
                                  isEnabled: canAfford,
                                  onButtonClick: () {
                                    if (canAfford) {
                                      debugPrint(
                                          "${exchangeItem.itemId} Blue button clicked!");
                                      debugPrint(
                                          "${exchangeItem.item.itemName} ${exchangeItem.item.expBooster?.boostMultiplier} ${exchangeItem.item.expBooster?.boostDays} ${exchangeItem.item.gemExchange?.gemReward} ${exchangeItem.item.priceGem} ${exchangeItem.item.priceExp}");

                                      context.read<ExchangeBloc>().add(
                                          BuyItemEvent(
                                              itemId: exchangeItem.itemId));

                                      showDialog(
                                        context: context,
                                        barrierDismissible: false,
                                        builder: (BuildContext context) {
                                          return SuccessDialog(
                                            reward: exchangeItem
                                                .item.gemExchange?.gemReward,
                                            dayBoostValue: exchangeItem.item
                                                .expBooster?.boostMultiplier,
                                            dayBoost: exchangeItem
                                                .item.expBooster?.boostDays,
                                            iconPath: state
                                                        .userExchange
                                                        .items[index]
                                                        .item
                                                        .itemType ==
                                                    "exp_boost"
                                                ? AppImages.boostIcon
                                                : AppImages.gemIcon,
                                            onClose: () {
                                              Navigator.of(context).pop();
                                              context
                                                  .read<ProfileBloc>()
                                                  .add(FetchUserProfile());
                                              context
                                                  .read<ExchangeBloc>()
                                                  .add(FetchAllItemEvent());
                                            },
                                          );
                                        },
                                      );
                                    }
                                  },
                                );
                              }).toList(),
                            );
                          },
                        );
                      } else if (state is MysteryBoxOpened &&
                          state.previousExchangeItems != null) {
                        // Important: show the previous exchange items during mystery box dialog
                        final exchangeItems =
                            state.previousExchangeItems!.items;
                        return Wrap(
                          spacing: 16,
                          runSpacing: 16,
                          alignment: WrapAlignment.spaceBetween,
                          children: exchangeItems.map((exchangeItem) {
                            return ExchangeItemComponent(
                              itemImagePath:
                                  exchangeItem.item.itemType == "exp_boost"
                                      ? AppImages.boostIcon
                                      : AppImages.gemIcon,
                              requiredImagePath:
                                  exchangeItem.item.itemType == "exp_boost"
                                      ? AppImages.gemIcon
                                      : AppImages.expCoinSvg,
                              itemValue: exchangeItem.item.itemType ==
                                      "exp_boost"
                                  ? (exchangeItem.item.expBooster
                                              ?.boostMultiplier ??
                                          0.0)
                                      .toDouble()
                                  : (exchangeItem.item.gemExchange?.gemReward ??
                                          0)
                                      .toDouble(),
                              requiredValue:
                                  exchangeItem.item.itemType == "exp_boost"
                                      ? exchangeItem.item.priceGem
                                      : exchangeItem.item.priceExp,
                              onButtonClick: () {
                                debugPrint("Blue button clicked!");
                              },
                            );
                          }).toList(),
                        );
                      } else if (state is ExchangeError) {
                        return Center(
                            child: Column(
                          children: [
                            Image.asset(AppImages.catNoItemimage, height: 128),
                            const SizedBox(height: 32),
                            Text(state.errorMessage),
                          ],
                        ));
                      } else if (state is ExchangeUserItemLoaded) {
                        final exchangeItems = state.userExchange.items;

                        return BlocBuilder<ProfileBloc, ProfileState>(
                          builder: (context, profileState) {
                            int userGems = 0;
                            int userExp = 0;

                            if (profileState is ProfileLoaded) {
                              userGems = profileState.userProfile.gem;
                              userExp = profileState.userProfile.exp;
                            }
                            return Wrap(
                              spacing: 16,
                              runSpacing: 16,
                              alignment: WrapAlignment.spaceBetween,
                              children:
                                  exchangeItems.asMap().entries.map((entry) {
                                final int index = entry.key;
                                final exchangeItem = entry.value;

                                final bool canAfford =
                                    exchangeItem.item.itemType == "exp_boost"
                                        ? userGems >= exchangeItem.item.priceGem
                                        : userExp >= exchangeItem.item.priceExp;

                                return ExchangeItemComponent(
                                  itemImagePath:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? AppImages.boostIcon
                                          : AppImages.gemIcon,
                                  requiredImagePath:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? canAfford
                                              ? AppImages.gemIcon
                                              : AppImages.gemNotCheckSvg
                                          : canAfford
                                              ? AppImages.expCoinSvg
                                              : AppImages.greyEXPIcon,
                                  itemValue:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? (exchangeItem.item.expBooster
                                                      ?.boostMultiplier ??
                                                  0.0)
                                              .toDouble()
                                          : (exchangeItem.item.gemExchange
                                                      ?.gemReward ??
                                                  0)
                                              .toDouble(),
                                  dayBoost: exchangeItem.item.itemType ==
                                          "exp_boost"
                                      ? exchangeItem.item.expBooster?.boostDays
                                      : null,
                                  requiredValue:
                                      exchangeItem.item.itemType == "exp_boost"
                                          ? exchangeItem.item.priceGem
                                          : exchangeItem.item.priceExp,
                                  isEnabled: canAfford,
                                  onButtonClick: () {
                                    if (canAfford) {
                                      debugPrint(
                                          "${exchangeItem.itemId} Blue button clicked!");
                                      debugPrint(
                                          "${exchangeItem.item.itemName} ${exchangeItem.item.expBooster?.boostMultiplier} ${exchangeItem.item.expBooster?.boostDays} ${exchangeItem.item.gemExchange?.gemReward} ${exchangeItem.item.priceGem} ${exchangeItem.item.priceExp}");

                                      context.read<ExchangeBloc>().add(
                                          BuyItemEvent(
                                              itemId: exchangeItem.itemId));

                                      showDialog(
                                        context: context,
                                        barrierDismissible: false,
                                        builder: (BuildContext context) {
                                          return SuccessDialog(
                                            reward: exchangeItem
                                                .item.gemExchange?.gemReward,
                                            dayBoostValue: exchangeItem.item
                                                .expBooster?.boostMultiplier,
                                            dayBoost: exchangeItem
                                                .item.expBooster?.boostDays,
                                            iconPath: state
                                                        .userExchange
                                                        .items[index]
                                                        .item
                                                        .itemType ==
                                                    "exp_boost"
                                                ? AppImages.boostIcon
                                                : AppImages.gemIcon,
                                            onClose: () {
                                              Navigator.of(context).pop();
                                              context
                                                  .read<ProfileBloc>()
                                                  .add(FetchUserProfile());
                                              context
                                                  .read<ExchangeBloc>()
                                                  .add(FetchAllItemEvent());
                                            },
                                          );
                                        },
                                      );
                                    }
                                  },
                                );
                              }).toList(),
                            );
                          },
                        );
                      } else {
                        return const Center(child: Text(''));
                      }
                    },
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
