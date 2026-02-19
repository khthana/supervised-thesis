import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../../../config/constants/app_pages.dart';
import '../bloc/exchange_bloc.dart';
import '../bloc/exchange_event.dart';
import '../bloc/exchange_state.dart';
import '../widget/exchange_item_component.dart';

class MyItemScreen extends StatelessWidget {
  const MyItemScreen({super.key});

  @override
  Widget build(BuildContext context) {
    BlocProvider.of<ExchangeBloc>(context).add(FetchUserItemEvent());

    return Scaffold(
        extendBodyBehindAppBar: true,
        appBar: CustomAppBarWithStep(
          context: context,
          onLeading: true,
          onBackPressed: () => context.goNamed(AppPages.exchangeName),
          bgColor: AppColors.transparentColor,
          titleText: AppStrings.myItemText,
          totalSteps: 1,
          currentStep: 1,
        ),
        body: SingleChildScrollView(
            child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 122),
                child: Column(children: [
                  //using Item
                  Padding(
                    padding: const EdgeInsets.only(bottom: 36),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Text(
                              AppStrings.activeText,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 18),
                            ),
                          ],
                        ),
                        Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: BlocBuilder<ExchangeBloc, ExchangeState>(
                              builder: (context, state) {
                                if (state is ExchangeUserItemLoading) {
                                  return const Center(
                                      child: CircularProgressIndicator());
                                } else if (state is ExchangeError) {
                                  return Center(
                                      child: Column(
                                    children: [
                                      Image.asset(AppImages.catNoItemimage,
                                          height: 128),
                                      Text(state.errorMessage),
                                    ],
                                  ));
                                } else if (state is ExchangeUserItemLoaded) {
                                  final filteredItems = state.userExchange.items
                                      .where((item) =>
                                          item.expireDate != null &&
                                          item.isActive == true &&
                                          item.item.itemType == "exp_boost" &&
                                          item.expireDate!
                                              .isAfter(DateTime.now()))
                                      .toList();

                                  if (filteredItems.isEmpty) {
                                    return Center(
                                        child: Text('ไม่มีไอเทมที่ใช้งานอยู่',
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodyMedium
                                                ?.copyWith(
                                                  color: AppColors.greyColor,
                                                )));
                                  }

                                  return Wrap(
                                    spacing: 16,
                                    runSpacing: 16,
                                    alignment: WrapAlignment.start,
                                    children: filteredItems
                                        .asMap()
                                        .entries
                                        .map((entry) {
                                      final exchangeItem = entry.value;

                                      return ExchangeItemComponent(
                                        itemImagePath: AppImages.boostIcon,
                                        expiredDate: exchangeItem.isActive
                                            ? exchangeItem.expireDate
                                            : null,
                                        itemValue: (exchangeItem.item.expBooster
                                                    ?.boostMultiplier ??
                                                0.0)
                                            .toDouble(),
                                        dayBoost: exchangeItem
                                            .item.expBooster?.boostDays,
                                      );
                                    }).toList(),
                                  );
                                } else {
                                  return const Center(
                                      child:
                                          Text(AppStrings.noDataAvaliableText));
                                }
                              },
                            )),
                      ],
                    ),
                  ),

                  //all item
                  Column(
                    children: [
                      Row(
                        children: [
                          Text(
                            AppStrings.myAllItemText,
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
                          if (state is ExchangeUserItemLoading) {
                            return const Center(
                                child: CircularProgressIndicator());
                          } else if (state is ExchangeError) {
                            return Center(
                                child: Column(
                              children: [
                                Image.asset(AppImages.catNoItemimage,
                                    height: 128),
                                const SizedBox(height: 32),
                                Text(state.errorMessage),
                              ],
                            ));
                          } else if (state is ExchangeUserItemLoaded) {
                            final filteredItems = state.userExchange.items
                                .where((item) =>
                                    item.isActive == false &&
                                    item.item.itemType == "exp_boost" &&
                                    (item.expireDate == null ||
                                        item.expireDate!
                                            .isAfter(DateTime.now())))
                                .toList();

                            if (filteredItems.isEmpty) {
                              return Center(
                                  child: Column(
                                children: [
                                  Image.asset(AppImages.catNoItemimage,
                                      height: 128),
                                  const SizedBox(height: 32),
                                  Text('ยังไม่มีไอเทม',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: AppColors.greyColor,
                                          )),
                                ],
                              ));
                            }

                            return Wrap(
                              spacing: 16,
                              runSpacing: 16,
                              alignment: WrapAlignment.spaceBetween,
                              children:
                                  filteredItems.asMap().entries.map((entry) {
                                final int index = entry.key;
                                final exchangeItem = entry.value;

                                return ExchangeItemComponent(
                                  itemImagePath: AppImages.boostIcon,
                                  itemValue: (exchangeItem.item.expBooster
                                              ?.boostMultiplier ??
                                          0.0)
                                      .toDouble(),
                                  dayBoost:
                                      exchangeItem.item.expBooster?.boostDays,
                                  onButtonClick: () {
                                    debugPrint(
                                        "${exchangeItem.itemId} Active button clicked!");

                                    context.read<ExchangeBloc>().add(
                                        ActiveItemEvent(
                                            filteredItems[index].userItemId));

                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                          content: Text('ใช้งานสำเร็จ!')),
                                    );
                                  },
                                );
                              }).toList(),
                            );
                          } else {
                            return const Center(
                                child: Text(AppStrings.noDataAvaliableText));
                          }
                        },
                      )
                    ],
                  )
                ]))));
  }
}
