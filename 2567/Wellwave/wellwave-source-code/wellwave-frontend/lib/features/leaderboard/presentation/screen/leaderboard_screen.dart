import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../../profile/presentation/widget/profile/round_border_text.dart';
import '../../data/models/leaderboard_request_model.dart';
import '../bloc/leaderboard_bloc.dart';
import '../bloc/leaderboard_event.dart';
import '../bloc/leaderboard_state.dart';
import '../../../../config/constants/app_url.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    context.read<LeaderBoardBloc>().add(FetchUserBoard());

    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      appBar: CustomAppBar(
          title: AppStrings.leaderboardText,
          textColor: AppColors.whiteColor,
          context: context,
          onLeading: true),
      body: BlocBuilder<LeaderBoardBloc, LeaderBoardState>(
        builder: (context, state) {
          if (state is LeaderBoardLoaded) {
            final userBoard = state.userBoard;
            final userLeague = userBoard.league;

            if (userLeague == -1) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(AppImages.catNoItemimage, height: 128),
                    const SizedBox(
                      height: 20,
                    ),
                    Text(
                      AppStrings.youNotInLeagueYet,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.whiteColor,
                          ),
                    ),
                  ],
                ),
              );
            }

            final userImage = userBoard.userStats.user.imageUrl;
            final username = userBoard.userStats.user.username;
            final boardMembers = userBoard.boardMembers;

            Widget profileImage;

            if (userImage!.isNotEmpty) {
              final imageUrl = "$baseUrl$userImage";
              profileImage = ClipOval(
                child: Image.network(
                  imageUrl,
                  width: 40,
                  height: 40,
                  fit: BoxFit.cover,
                ),
              );
            } else {
              profileImage = const CircleAvatar(
                radius: 20,
                backgroundImage: AssetImage(AppImages.catImg),
              );
            }

            return Stack(children: [
              Column(
                children: [
                  Expanded(
                    flex: 1,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Center(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            //league
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                RoundedText(
                                  text:
                                      '${AppStrings.leagueText}${AppStrings.leagueList[userLeague]}',
                                  svgPath: AppImages.leagueListIcon[userLeague],
                                  backgroundColor: Colors.transparent,
                                  textColor: AppColors.whiteColor,
                                ),
                              ],
                            ),

                            //switch
                            // const SwitchButton(),
                            const SizedBox(
                              height: 24,
                            ),
                            //day remain
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                RoundedText(
                                  text: userBoard.dayLeft != 0
                                      ? '${userBoard.dayLeft} ${AppStrings.dayText}'
                                      : 'วันสุดท้าย',
                                  svgPath: AppImages.clockIcon,
                                  backgroundColor: const Color(0xFF2352BC),
                                  iconColor: AppColors.whiteColor,
                                  textColor: AppColors.whiteColor,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  //4-10
                  Expanded(
                    flex: 1,
                    child: Container(
                      padding: const EdgeInsets.only(
                          top: 33, bottom: 95, left: 20, right: 20),
                      color: AppColors.whiteColor,
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        itemCount: boardMembers.members.length - 3,
                        separatorBuilder: (context, index) => Divider(
                          color: Colors.grey.shade300,
                          thickness: 1,
                        ),
                        itemBuilder: (context, index) {
                          final member = boardMembers.members[index + 3];

                          return Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 42,
                                  child: Text(
                                    '#${member.currentRank}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Colors.black,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 24),
                                CircleAvatar(
                                  radius: 20,
                                  backgroundImage: member.user.imageUrl != null
                                      ? NetworkImage(
                                              "$baseUrl${member.user.imageUrl}")
                                          as ImageProvider<Object>
                                      : const AssetImage(AppImages.catImg)
                                          as ImageProvider<Object>,
                                ),
                                const SizedBox(width: 36),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text('${member.user.username}',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium),
                                      const SizedBox(height: 4),
                                      Text('${member.currentExp} EXP',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),

              //1-3
              Positioned(
                bottom: 330,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildPodium(context, boardMembers.members[1],
                        AppColors.yellowColor, 93),
                    _buildPodium(context, boardMembers.members[0],
                        AppColors.mintColor, 123,
                        isFirst: true),
                    _buildPodium(context, boardMembers.members[2],
                        AppColors.pinkColor, 63),
                  ],
                ),
              ),
              //my rank
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  height: 95,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  decoration: const BoxDecoration(
                    color: Color(0xFFD0E0FF),
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(12)),
                  ),
                  child: Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 42,
                          child: Text(
                            '#${userBoard.userStats.currentRank}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        const SizedBox(width: 24),
                        profileImage,
                        const SizedBox(width: 36),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(username!,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith()),
                              const SizedBox(height: 4),
                              Text('${userBoard.userStats.currentExp} EXP',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith()),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ]);
          } else if (state is LeaderBoardError) {
            return Center(
                child: Column(
              children: [
                Image.asset(AppImages.catNoItemimage, height: 128),
                const SizedBox(height: 32),
                Text(state.errorMessage),
              ],
            ));
          } else if (state is LeaderBoardLoading) {
            return const Center(child: CircularProgressIndicator());
          } else {
            return const Center(child: Text(AppStrings.noDataAvaliableText));
          }
        },
      ),
    );
  }

  Widget _buildPodium(
      BuildContext context, MemberRequestModel user, Color color, double height,
      {bool isFirst = false}) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.topCenter,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 16.0),
              child: CircleAvatar(
                radius: 36,
                backgroundImage: user.user.imageUrl != null
                    ? NetworkImage("$baseUrl${user.user.imageUrl}")
                        as ImageProvider<Object>
                    : const AssetImage(AppImages.catImg)
                        as ImageProvider<Object>,
              ),
            ),
            if (isFirst)
              Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: SvgPicture.asset(AppImages.firstRankIcon))
          ],
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Text(
            user.user.username ?? '',
            style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 3),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text('${user.currentExp} EXP',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: AppColors.whiteColor, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 16),
        Container(
          width: isFirst ? 177 : 84,
          height: height,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: color,
          ),
          child: Text(user.currentRank.toString(),
              style: isFirst
                  ? Theme.of(context)
                      .textTheme
                      .titleXL
                      ?.copyWith(color: AppColors.whiteColor)
                  : Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.whiteColor,
                        fontWeight: FontWeight.bold,
                      )),
        ),
      ],
    );
  }
}
