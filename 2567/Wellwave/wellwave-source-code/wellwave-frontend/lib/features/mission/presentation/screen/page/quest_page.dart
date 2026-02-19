import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/task_list.dart';
import 'package:go_router/go_router.dart';

class QuestPage extends StatelessWidget {
  const QuestPage({super.key});

  @override
  Widget build(BuildContext context) {
    context.read<MissionBloc>().add(LoadQuestsEvent());

    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: AppStrings.questText,
        backgroundColor: AppColors.pinkColor,
        titleColor: AppColors.whiteColor,
        textColor: AppColors.whiteColor,
        onLeading: true,
      ),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              color: AppColors.pinkColor,
            ),
            height: MediaQuery.of(context).size.height * 0.15,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 0.0),
            child: Column(
              children: [
                Expanded(
                  child: BlocBuilder<MissionBloc, MissionState>(
                    builder: (context, state) {
                      if (state is QuestLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (state is QuestLoaded) {
                        final quests = state.quests.quests;
                        if (quests.isEmpty) {
                          return const Center(
                            child: Text('No quests available'),
                          );
                        }

                        return ListView.builder(
                          itemCount: quests.length,
                          itemBuilder: (context, index) {
                            final sortedQuests = [...quests]..sort((a, b) {
                                if (a.isActive == b.isActive) return 0;
                                return a.isActive ? 1 : -1;
                              });

                            final quest = sortedQuests[index];
                            return TaskList(
                              imagePath: quest.imgUrl ?? '',
                              taskId: quest.qid,
                              taskName: quest.title,
                              gemReward: quest.gemRewards,
                              isActive: quest.isActive,
                              isQuest: true,
                              progressPercentage:
                                  quest.progressInfo?.progressPercentage ?? 0.0,
                              onTap: () {
                                if (quest.progressInfo?.progressPercentage !=
                                    100) {
                                  context.goNamed(
                                    AppPages.questDetailName,
                                    pathParameters: {
                                      'questId': quest.qid.toString()
                                    },
                                  );
                                }
                              },
                            );
                          },
                        );
                      }

                      if (state is QuestError) {
                        return Center(
                          child: Text(state.message),
                        );
                      }

                      return Container();
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
