// import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/routes/app_routes.dart';
import 'package:wellwave_frontend/config/theme/app_theme.dart';
import 'package:wellwave_frontend/features/exchange/data/repositories/exchange_repositories.dart';
import 'package:wellwave_frontend/features/exchange/presentation/bloc/exchange_bloc.dart';
import 'package:wellwave_frontend/features/friend/data/repositories/friend_repositories.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/article/data/repositories/article_repository.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_bloc.dart';
import 'package:wellwave_frontend/features/health_assessment/presentation/bloc/health_assessment/health_assessment_bloc.dart';
import 'package:wellwave_frontend/features/leaderboard/data/repositories/leaderboard_repositories.dart';
import 'package:wellwave_frontend/features/leaderboard/presentation/bloc/leaderboard_bloc.dart';
import 'package:wellwave_frontend/features/logs/data/repositories/logs_repositories.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/mission/data/repositories/habit_repositories.dart';
import 'package:wellwave_frontend/features/notification/data/repositories/notification_repositories.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/archeivement_repositories.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/archeivement_bloc/archeivement_bloc.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_bloc.dart';
import 'package:wellwave_frontend/features/start_overview/presentation/bloc/start_overview_bloc.dart';

import 'features/authentication/data/repositories/auth_repository.dart';
import 'features/authentication/presentation/bloc/auth_bloc.dart';
import 'features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'features/home/data/repositories/home_repository.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'features/home/presentation/bloc/home_event.dart';
import 'features/notification/presentation/bloc/noti_bloc.dart';
import 'features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'package:wellwave_frontend/features/home/data/repositories/home_repository.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp();
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    final authRepository = AuthRepository();

    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider<LogsRequestRepository>(
          create: (context) => LogsRequestRepository(),
        ),
        RepositoryProvider<NotificationSettingRepository>(
          create: (context) => NotificationSettingRepository(),
        ),
        RepositoryProvider<ArcheivementRepositories>(
          create: (context) => ArcheivementRepositories(),
        ),
        RepositoryProvider<HealthAssessmentRepository>(
          create: (context) => HealthAssessmentRepository(),
        ),
        RepositoryProvider<FriendRepositories>(
          create: (context) => FriendRepositories(),
        ),
        RepositoryProvider<ProfileRepositories>(
          create: (context) => ProfileRepositories(),
        ),
        RepositoryProvider<LoginStreakRepository>(
          create: (context) => LoginStreakRepository(),
        ),
        RepositoryProvider<HabitRepositories>(
          create: (context) => HabitRepositories(),
        ),
        RepositoryProvider<HealthDataRepository>(
          create: (context) => HealthDataRepository(),
        ),
        RepositoryProvider<UserChallengesRepository>(
          create: (context) => UserChallengesRepository(),
        ),
        RepositoryProvider<ArticleRepository>(
          create: (context) => ArticleRepository(),
        ),
        RepositoryProvider<HealthAssessmentRepository>(
          create: (context) => HealthAssessmentRepository(),
        ),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<StartRecommendBloc>(
            create: (context) => StartRecommendBloc(totalPages: 3),
          ),
          BlocProvider<LogsBloc>(
            create: (context) =>
                LogsBloc(context.read<LogsRequestRepository>()),
            lazy: false,
          ),
          BlocProvider<ProfileBloc>(
            create: (context) =>
                ProfileBloc(profileRepositories: ProfileRepositories()),
            lazy: false,
          ),
          BlocProvider<LeaderBoardBloc>(
            create: (context) => LeaderBoardBloc(
                leaderBoardRepositories: LeaderboardRepositories()),
            lazy: false,
          ),
          BlocProvider<ExchangeBloc>(
            create: (context) =>
                ExchangeBloc(exchangeRepositories: ExchangeRepositories()),
            lazy: false,
          ),
          BlocProvider<NotiBloc>(
            create: (context) =>
                NotiBloc(context.read<NotificationSettingRepository>()),
            lazy: false,
          ),
          BlocProvider<ArcheivementBloc>(
            create: (context) => ArcheivementBloc(
                archeivementRepositories: ArcheivementRepositories()),
            lazy: false,
          ),
          BlocProvider(
              create: (context) => ArticleBloc(
                    ArticleRepository(),
                    // Pass a default instance of BookmarkModel
                  )),
          BlocProvider<HomeBloc>(
            create: (context) => HomeBloc(
              profileRepository: ProfileRepositories(),
              currentDate: DateTime.now(),
              healthAssessmentRepository: HealthAssessmentRepository(),
              loginStreakRepository: LoginStreakRepository(),
              notificationsRepository: NotificationsRepository(),
              healthDataRepository: HealthDataRepository(),
              userChallengesRepository: UserChallengesRepository(),
              recommendHabitRepository: RecommendHabitRepository(),
              habitRepositories: HabitRepositories(),
            )..add(FetchHomeEvent(context)),
          ),
          BlocProvider<AuthBloc>(
            create: (context) => AuthBloc(authRepository: authRepository),
          ),
          BlocProvider<MissionBloc>(
            create: (context) => MissionBloc(
              habitRepositories: HabitRepositories(),
              profileRepository: ProfileRepositories(),
            ),
          ),
          BlocProvider<HealthAssessmentBloc>(
            create: (context) =>
                HealthAssessmentBloc(HealthAssessmentRepository()),
          ),
          BlocProvider<FriendBloc>(
            create: (context) => FriendBloc(
              friendRepositories: context.read<FriendRepositories>(),
              profileRepositories: context.read<ProfileRepositories>(),
            ),
            lazy: false,
          ),
        ],
        child: MaterialApp.router(
          routerConfig: goRouter,
          title: 'WellWave Application',
          debugShowCheckedModeBanner: false,
          theme: appTheme(context),
        ),
      ),
    );
  }
}
