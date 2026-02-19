import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:wellwave_frontend/common/widget/custom_nav_bar.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/enums/navigation_enum.dart';
import 'package:wellwave_frontend/features/article/presentation/screen/all_article_screen.dart';
import 'package:wellwave_frontend/features/article/presentation/screen/article_detail_screen.dart';

import 'package:wellwave_frontend/features/exchange/presentation/screen/exchange_screen.dart';
import 'package:wellwave_frontend/features/exchange/presentation/screen/my_item_screen.dart';
import 'package:wellwave_frontend/features/friend/presentation/screen/find_friend_screen.dart';
import 'package:wellwave_frontend/features/friend/presentation/screen/friend_profile_screen.dart';
import 'package:wellwave_frontend/features/health_assessment/presentation/screen/health_assessment_screen.dart';
import 'package:wellwave_frontend/features/authentication/presentation/screen/authentication_screen.dart';
import 'package:wellwave_frontend/features/authentication/presentation/screen/page/forgot_password_sceen.dart';
import 'package:wellwave_frontend/features/authentication/presentation/screen/page/login_screen.dart';
import 'package:wellwave_frontend/features/authentication/presentation/screen/page/register_screen.dart';

import 'package:wellwave_frontend/features/home/presentation/screen/friend_screen.dart';
import 'package:wellwave_frontend/features/home/presentation/screen/home/notification_screen.dart';
import 'package:wellwave_frontend/features/home/presentation/screen/home_screen.dart';
import 'package:wellwave_frontend/features/mission/data/repositories/habit_repositories.dart';
import 'package:wellwave_frontend/features/home/presentation/screen/mission_screen.dart';
import 'package:wellwave_frontend/features/logs/presentation/screen/logs_history_screen.dart';
import 'package:wellwave_frontend/features/logs/presentation/screen/logs_screen.dart';
import 'package:wellwave_frontend/features/home/presentation/screen/splash_screen.dart';
import 'package:wellwave_frontend/features/mission/presentation/screen/page/daily_task_page.dart';
import 'package:wellwave_frontend/features/mission/presentation/screen/page/habit_challenge_page.dart';
import 'package:wellwave_frontend/features/mission/presentation/screen/page/mission_history_screen.dart';
import 'package:wellwave_frontend/features/mission/presentation/screen/page/mission_record_page.dart';
import 'package:wellwave_frontend/features/mission/presentation/screen/page/quest_page.dart';
import 'package:wellwave_frontend/features/start_overview/presentation/screen/start_overview_screen.dart';

import '../../features/article/presentation/screen/article_screen.dart';
import '../../features/authentication/presentation/screen/widget/register_success.dart';
import '../../features/leaderboard/presentation/screen/leaderboard_screen.dart';
import '../../features/notification/presentation/screen/drink_plan_screen.dart';
import '../../features/notification/presentation/screen/reminder_screen.dart';
import '../../features/home/presentation/screen/home/health_reassessment.dart';
import '../../features/profile/presentation/screen/achievement_screen.dart';
import '../../features/profile/presentation/screen/edit_profile_screen.dart';
import '../../features/profile/presentation/screen/profile_screen.dart';
import '../../features/profile/presentation/screen/set_weekly_goal_screen.dart';

import '../../features/mission/presentation/screen/page/quest_detail_page.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

final GoRouter goRouter = GoRouter(
  initialLocation: AppPages.splashPath,
  routes: [
    GoRoute(
      path: AppPages.splashPath,
      name: AppPages.splashName,
      pageBuilder: (BuildContext context, GoRouterState state) {
        return const NoTransitionPage(child: SplashScreen());
      },
      routes: [
        GoRoute(
          path: AppPages.authenticationPage,
          name: AppPages.authenticationName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return const NoTransitionPage(child: AuthenticationScreen());
          },
        ),
        GoRoute(
          path: AppPages.registerPage,
          name: AppPages.registerName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return NoTransitionPage(child: RegisterScreen());
          },
        ),
        GoRoute(
          path: AppPages.registerSuccessPage,
          name: AppPages.registerSuccessName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return const NoTransitionPage(child: RegisterSuccess());
          },
        ),
        GoRoute(
          path: AppPages.loginPage,
          name: AppPages.loginName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return NoTransitionPage(child: LoginScreen());
          },
        ),
        GoRoute(
          path: AppPages.forgotPasswordPage,
          name: AppPages.forgetPasswordName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return NoTransitionPage(child: ForgotPasswordScreen());
          },
        ),
        GoRoute(
          path: AppPages.startPage,
          name: AppPages.startName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return NoTransitionPage(child: StartOverviewScreen());
          },
        ),
        GoRoute(
            path: AppPages.homePage,
            name: AppPages.homeName,
            pageBuilder: (BuildContext context, GoRouterState state) {
              return _buildPageWithNavBar(context, state, const HomeScreen());
            },
            routes: [
              GoRoute(
                path: AppPages.notificationPage,
                name: AppPages.notificationName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return const NoTransitionPage(child: NotificationScreen());
                },
              ),
              GoRoute(
                  path: AppPages.profilePage,
                  name: AppPages.profileName,
                  pageBuilder: (BuildContext context, GoRouterState state) {
                    return const NoTransitionPage(child: ProfileScreen());
                  },
                  routes: [
                    GoRoute(
                      path: AppPages.editProfilePage,
                      name: AppPages.editProfileName,
                      pageBuilder: (BuildContext context, GoRouterState state) {
                        return const NoTransitionPage(
                            child: EditProfileScreen());
                      },
                    ),
                    GoRoute(
                      path: AppPages.leaderboardlPage,
                      name: AppPages.leaderboardlName,
                      pageBuilder: (BuildContext context, GoRouterState state) {
                        return const NoTransitionPage(
                            child: LeaderboardScreen());
                      },
                    ),
                    GoRoute(
                      path: AppPages.exchangePage,
                      name: AppPages.exchangeName,
                      pageBuilder: (BuildContext context, GoRouterState state) {
                        return const NoTransitionPage(child: ExchangeScreen());
                      },
                      routes: [
                        GoRoute(
                          path: AppPages.myItemPage,
                          name: AppPages.myItemName,
                          pageBuilder:
                              (BuildContext context, GoRouterState state) {
                            return const NoTransitionPage(
                                child: MyItemScreen());
                          },
                        ),
                      ],
                    ),
                    GoRoute(
                      path: AppPages.achievementPage,
                      name: AppPages.achievementName,
                      pageBuilder: (BuildContext context, GoRouterState state) {
                        return _buildPageWithNavBar(
                            context, state, const AchievementScreen());
                      },
                    ),
                    GoRoute(
                        path: AppPages.reminderPage,
                        name: AppPages.reminderName,
                        pageBuilder:
                            (BuildContext context, GoRouterState state) {
                          return _buildPageWithNavBar(
                              context, state, const ReminderScreen());
                        },
                        routes: [
                          GoRoute(
                            path: AppPages.drinkPlanPage,
                            name: AppPages.drinkPlanName,
                            pageBuilder:
                                (BuildContext context, GoRouterState state) {
                              return _buildPageWithNavBar(
                                  context, state, const DrinkPlanScreen());
                            },
                          ),
                        ]),
                    GoRoute(
                      path: AppPages.setWeeklyGoalPage,
                      name: AppPages.setWeeklyGoalName,
                      pageBuilder: (BuildContext context, GoRouterState state) {
                        return _buildPageWithNavBar(
                            context, state, const SetWeeklyGoalScreen());
                      },
                    ),
                  ]),
            ]),
        GoRoute(
            path: AppPages.logPage,
            name: AppPages.logName,
            pageBuilder: (BuildContext context, GoRouterState state) {
              return _buildPageWithNavBar(context, state, const LogsScreen());
            },
            routes: [
              GoRoute(
                path: AppPages.logHistoryPage,
                name: AppPages.logHistoryName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return const NoTransitionPage(child: LogsHistoryScreen());
                },
              ),
            ]),
        GoRoute(
            path: AppPages.missionPage,
            name: AppPages.missionName,
            pageBuilder: (BuildContext context, GoRouterState state) {
              return _buildPageWithNavBar(
                  context, state, const MissionScreen());
            },
            routes: [
              GoRoute(
                path: 'record/:hid',
                name: AppPages.missionRecordName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  final Map<String, dynamic> extras =
                      state.extra as Map<String, dynamic>;
                  return NoTransitionPage(
                    child: Provider<HabitRepositories>(
                      create: (context) => HabitRepositories(),
                      child: MissionRecordPage(
                        hid: int.parse(state.pathParameters['hid'] ?? '0'),
                        title: extras['title'] as String? ?? 'Mission Record',
                        adviceText:
                            extras['adviceText'] as String? ?? 'Advice Text',
                        minutesGoal: extras['minutesGoal'] as int? ?? 1,
                        challengeId: extras['challengeId'] as int? ?? 0,
                        expReward: extras['expReward'] as int? ?? 0,
                      ),
                    ),
                  );
                },
              ),
              GoRoute(
                path: AppPages.dailyTaskPage,
                name: AppPages.dailyTaskName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return NoTransitionPage(child: DailyTaskPage());
                },
              ),
              GoRoute(
                path: AppPages.habitChallengePage,
                name: AppPages.habitChallengeName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return NoTransitionPage(child: HabitChallengePage());
                },
              ),
              GoRoute(
                path: AppPages.questPage,
                name: AppPages.questName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return const NoTransitionPage(child: QuestPage());
                },
                routes: [
                  GoRoute(
                    path: ':questId',
                    name: AppPages.questDetailName,
                    pageBuilder: (BuildContext context, GoRouterState state) {
                      final questId =
                          int.parse(state.pathParameters['questId'] ?? '0');
                      return NoTransitionPage(
                        child: QuestDetailPage(
                          questId: questId,
                        ),
                      );
                    },
                  ),
                ],
              ),
              GoRoute(
                path: AppPages.missionHistoryPage,
                name: AppPages.missionHistoryName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return const NoTransitionPage(child: MissionHistoryScreen());
                },
              ),
            ]),
        GoRoute(
            path: AppPages.friendPage,
            name: AppPages.friendName,
            pageBuilder: (BuildContext context, GoRouterState state) {
              return _buildPageWithNavBar(context, state, const FriendScreen());
            },
            routes: [
              GoRoute(
                path: AppPages.findFriendPage,
                name: AppPages.findFriendName,
                pageBuilder: (BuildContext context, GoRouterState state) {
                  return const NoTransitionPage(child: FindFriendScreen());
                },
              ),
              GoRoute(
                path: '${AppPages.profileFriendPage}/:uid',
                name: AppPages.profileFriendName,
                builder: (context, state) {
                  final uid = state.pathParameters['uid'];
                  return FriendProfileScreen(friendUid: uid ?? '-1');
                },
              ),
            ]),
        GoRoute(
            path: AppPages.articlePage,
            name: AppPages.articleName,
            pageBuilder: (BuildContext context, GoRouterState state) {
              return _buildPageWithNavBar(
                  context, state, const ArticleScreen());
            },
            routes: [
              GoRoute(
                  path: AppPages.articleDetailPage,
                  name: AppPages.articleDetailName,
                  pageBuilder: (BuildContext context, GoRouterState state) {
                    return const NoTransitionPage(child: ArticleDetailScreen());
                  }),
              GoRoute(
                  path: AppPages.allArticlePage,
                  name: AppPages.allArticleName,
                  pageBuilder: (BuildContext context, GoRouterState state) {
                    return const NoTransitionPage(child: AllArticlesScreen());
                  })
            ]),
        GoRoute(
          path: AppPages.reassessmentPage,
          name: AppPages.reassessmentName,
          pageBuilder: (BuildContext context, GoRouterState state) {
            return CustomTransitionPage(
              child: const ReAssessmentScreen(),
              transitionsBuilder:
                  (context, animation, secondaryAnimation, child) {
                return child;
              },
            );
          },
        ),
        GoRoute(
          path: AppPages.assessmentPage,
          name: AppPages.assessmentName,
          builder: (BuildContext context, GoRouterState state) {
            return const AssessmentScreen();
          },
        ),
      ],
    ),
  ],
);

Page _buildPageWithNavBar(
    BuildContext context, GoRouterState state, Widget child) {
  return NoTransitionPage(
    child: Scaffold(
      body: child,
      bottomNavigationBar: CustomNavigationBar(
        selectedIndex: _getSelectedIndex(state),
        onItemTapped: (index) {
          context.goNamed(NavigationPage.values[index].name);
        },
      ),
    ),
  );
}

int _getSelectedIndex(GoRouterState state) {
  final path = state.fullPath;
  if (path!.contains(AppPages.homePage)) return 0;
  if (path.contains(AppPages.logPage)) return 1;
  if (path.contains(AppPages.missionPage)) return 2;
  if (path.contains(AppPages.friendPage)) return 3;
  if (path.contains(AppPages.articlePage)) return 4;
  return 0;
}