import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/features/start_overview/presentation/bloc/start_overview_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

class StartRecommend extends StatelessWidget {
  final List<String> titles;
  final List<String> descriptions;
  final List<String> imageUrls;

  final PageController pageController = PageController();

  StartRecommend({
    Key? key,
    required this.titles,
    required this.descriptions,
    required this.imageUrls,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => StartRecommendBloc(totalPages: titles.length),
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(
              Icons.arrow_back,
              color: Colors.black,
            ),
            onPressed: () {
              final currentIndex =
                  context.read<StartRecommendBloc>().state.currentIndex;
              if (currentIndex > 0) {
                pageController.animateToPage(
                  currentIndex - 1,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                );
                context.read<StartRecommendBloc>().add(PreviousPageEvent());
              } else {
                context.goNamed(AppPages.splashName);
              }
            },
          ),
          actions: [
            BlocBuilder<StartRecommendBloc, StartRecommendState>(
              builder: (context, state) {
                if (state.currentIndex < titles.length - 1) {
                  return TextButton(
                    onPressed: () =>
                        context.goNamed(AppPages.authenticationName),
                    child: Text(
                      AppStrings.skipText,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  );
                }
                return Container();
              },
            ),
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              const SizedBox(height: 72),
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.55,
                child: BlocBuilder<StartRecommendBloc, StartRecommendState>(
                  builder: (context, state) {
                    return PageView.builder(
                      controller: pageController,
                      onPageChanged: (index) {
                        if (index > state.currentIndex) {
                          context
                              .read<StartRecommendBloc>()
                              .add(NextPageEvent());
                        } else {
                          context
                              .read<StartRecommendBloc>()
                              .add(PreviousPageEvent());
                        }
                      },
                      itemCount: titles.length,
                      itemBuilder: (context, index) {
                        return Column(
                          children: [
                            Column(
                              children: [
                                Image.asset(imageUrls[index]),
                                const SizedBox(height: 48),
                                Text(
                                  titles[index],
                                  style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  descriptions[index],
                                  style: const TextStyle(fontSize: 16),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 48),
                              ],
                            ),
                          ],
                        );
                      },
                    );
                  },
                ),
              ),
              BlocBuilder<StartRecommendBloc, StartRecommendState>(
                builder: (context, state) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(titles.length, (index) {
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.symmetric(horizontal: 4.0),
                        width: index == state.currentIndex ? 29.0 : 6.0,
                        height: 6.0,
                        decoration: BoxDecoration(
                          color: index == state.currentIndex
                              ? AppColors.secondaryDarkColor
                              : AppColors.blueGrayColor,
                          borderRadius: BorderRadius.circular(5.0),
                        ),
                      );
                    }),
                  );
                },
              ),
              Padding(
                padding: const EdgeInsets.only(top: 100.0),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: SizedBox(
                    width: 250,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        final currentIndex = context
                            .read<StartRecommendBloc>()
                            .state
                            .currentIndex;
                        if (currentIndex < titles.length - 1) {
                          pageController.animateToPage(
                            currentIndex + 1,
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                          context
                              .read<StartRecommendBloc>()
                              .add(NextPageEvent());
                        } else {
                          context.goNamed(AppPages.authenticationName);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: AppColors.whiteColor,
                        backgroundColor: AppColors.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child:
                          BlocBuilder<StartRecommendBloc, StartRecommendState>(
                        builder: (context, state) {
                          return Text(
                            state.currentIndex == titles.length - 1
                                ? AppStrings.enterText
                                : AppStrings.nextText,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(color: AppColors.whiteColor),
                          );
                        },
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
