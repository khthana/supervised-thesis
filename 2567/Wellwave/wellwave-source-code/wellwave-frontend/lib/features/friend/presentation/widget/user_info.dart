import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';

class UserInformation extends StatefulWidget {
  final String userID;
  final String userName;
  final int gemAmount;
  final int expAmount;
  final String imgUrl;
  final String league;

  const UserInformation({
    Key? key,
    required this.userID,
    required this.userName,
    required this.gemAmount,
    required this.expAmount,
    required this.imgUrl,
    required this.league,
  }) : super(key: key);

  @override
  _UserInformationState createState() => _UserInformationState();
}

class _UserInformationState extends State<UserInformation> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FriendBloc, FriendState>(
      builder: (context, state) {
        final leagueMap = {
          'bronze': AppStrings.firstLeaugeText,
          'silver': AppStrings.secondLeaugeText,
          'gold': AppStrings.thirdLeaugeText,
          'diamond': AppStrings.forthLeaugeText,
          'emerald': AppStrings.fifthLeaugeText,
        };

        final leagueIconMap = {
          'bronze': AppImages.firstLeagueIcon,
          'silver': AppImages.secondLeagueIcon,
          'gold': AppImages.thirdLeagueIcon,
          'diamond': AppImages.forthLeagueIcon,
          'emerald': AppImages.fifthLeagueIcon,
        };

        final leagueText = (widget.league == 'none')
            ? AppStrings.firstLeaugeText
            : leagueMap[widget.league] ?? widget.league;

        Widget profileImage;

        if (widget.imgUrl.isEmpty) {
          profileImage = CircleAvatar(
            radius: 52,
            backgroundColor: Colors.transparent,
            child: SvgPicture.asset(
              AppImages.avatarDefaultIcon,
            ),
          );
        } else {
          profileImage = CircleAvatar(
            radius: 52,
            backgroundColor: Colors.transparent,
            backgroundImage: Image.network(
              "$baseUrl${widget.imgUrl}",
              fit: BoxFit.cover,
            ).image,
          );
        }
        return Row(
          children: [
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                profileImage,
              ],
            ),
            const SizedBox(width: 24),
            Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.userName,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(),
                ),
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    color: AppColors.whiteColor,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SvgPicture.asset(
                        AppImages.gemIcon,
                        height: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.gemAmount}',
                        style:
                            Theme.of(context).textTheme.bodySmall?.copyWith(),
                      ),
                      const SizedBox(width: 16),
                      SvgPicture.asset(
                        AppImages.expIcon,
                        height: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.expAmount}',
                        style:
                            Theme.of(context).textTheme.bodySmall?.copyWith(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    color: AppColors.whiteColor,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SvgPicture.asset(
                        leagueIconMap[widget.league] ??
                            AppImages.firstLeagueIcon,
                        height: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        leagueText,
                        style:
                            Theme.of(context).textTheme.bodySmall?.copyWith(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}
