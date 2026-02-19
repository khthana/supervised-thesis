import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/common/widget/button_widget.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';

class QuestDetailPage extends StatelessWidget {
  final int questId;

  const QuestDetailPage({
    Key? key,
    required this.questId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double progressBarWidth = MediaQuery.of(context).size.width - 40;

    context.read<MissionBloc>().add(LoadQuestDetailEvent(questId: questId));

    return BlocBuilder<MissionBloc, MissionState>(
      builder: (context, state) {
        if (state is QuestLoaded) {
          final quest = state.quests.quests.firstWhere(
            (q) => q.qid == questId,
            orElse: () => throw Exception('Quest not found'),
          );

          final num progressPercentage =
              quest.progressInfo?.progressPercentage ?? 0.0;
          double progressValue = (progressPercentage).clamp(0.0, 100.0) / 100;
          return Scaffold(
            backgroundColor: AppColors.whiteColor,
            appBar: CustomAppBar(
              context: context,
              backgroundColor: AppColors.whiteColor,
              onLeading: true,
            ),
            body: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: AppColors.whiteColor,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.network(
                                  '$baseUrl${quest.imgUrl}' ??
                                      AppImages.emptyComponentImage,
                                  height: 128,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Image.asset(
                                    AppImages.emptyComponentImage,
                                    width: 128,
                                    height: 128,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 24),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    quest.title,
                                    style:
                                        Theme.of(context).textTheme.labelLarge,
                                    softWrap: true,
                                    maxLines: 3,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      SvgPicture.asset(
                                        AppImages.calendarIcon,
                                        width: 24,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${quest.dayDuration} วัน',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium,
                                      )
                                    ],
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(height: 36),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.whiteColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24.0,
                            vertical: 16,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'รางวัลที่จะได้รับ',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  SvgPicture.asset(
                                    AppImages.gemIcon,
                                    height: 36,
                                    fit: BoxFit.cover,
                                  ),
                                  Text(
                                    '   ${quest.gemRewards} Gem',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineMedium,
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.whiteColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24.0,
                            vertical: 12,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'รายละเอียด',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                quest.description,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  quest.isActive
                      ? Container(
                          child: Column(
                            children: [
                              Stack(
                                clipBehavior: Clip.none,
                                children: [
                                  Container(
                                    width: progressBarWidth,
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: LinearProgressIndicator(
                                        backgroundColor:
                                            AppColors.grayProgressColor,
                                        color: AppColors.skyBlueColor,
                                        minHeight: 16,
                                        value: progressValue,
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    left: (progressBarWidth * progressValue)
                                        .clamp(0.0, progressBarWidth - 32),
                                    top: -8,
                                    child: SvgPicture.asset(
                                        AppImages.processIcon,
                                        height: 32),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        )
                      : NextButton(
                          text: AppStrings.joinProgram,
                          onPressed: () {
                            context
                                .read<MissionBloc>()
                                .add(StartQuestEvent(questId: questId));
                          },
                        )
                ],
              ),
            ),
          );
        }

        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      },
    );
  }
}
