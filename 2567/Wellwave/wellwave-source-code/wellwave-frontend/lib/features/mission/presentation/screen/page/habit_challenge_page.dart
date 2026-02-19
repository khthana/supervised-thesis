import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import '../../widgets/task_list.dart';

class HabitChallengePage extends StatefulWidget {
  const HabitChallengePage({super.key});

  @override
  State<HabitChallengePage> createState() => _HabitChallengePageState();
}

class _HabitChallengePageState extends State<HabitChallengePage>
    with SingleTickerProviderStateMixin {
  String category = 'rec';
  int _currentTabIndex = 0;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();

    // Initialize the tab controller
    _tabController =
        TabController(length: 4, vsync: this, initialIndex: _currentTabIndex);
    _tabController.addListener(_handleTabChange);

    context.read<MissionBloc>().add(LoadHabitsEvent(category: category));
  }

  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  // Handle tab changes to ensure category stays in sync
  void _handleTabChange() {
    // Only proceed if the tab is actually changing and animation is complete
    if (_tabController.indexIsChanging ||
        _currentTabIndex == _tabController.index) return;

    final int newIndex = _tabController.index;
    final String newCategory;

    switch (newIndex) {
      case 1:
        newCategory = 'diet';
        break;
      case 2:
        newCategory = 'exercise';
        break;
      case 3:
        newCategory = 'sleep';
        break;
      default:
        newCategory = 'rec';
        break;
    }

    // Only update if the category actually changed
    if (category != newCategory) {
      setState(() {
        _currentTabIndex = newIndex;
        category = newCategory;
      });
      context.read<MissionBloc>().add(LoadHabitsEvent(category: newCategory));
      debugPrint(
          'Loading habits for category: $category (tab index: $_currentTabIndex)');
    }
  }

  // Ensure tab and category are synchronized when returning from dialogs
  void _ensureCategorySync() {
    final String expectedCategory;
    switch (_tabController.index) {
      case 1:
        expectedCategory = 'diet';
        break;
      case 2:
        expectedCategory = 'exercise';
        break;
      case 3:
        expectedCategory = 'sleep';
        break;
      default:
        expectedCategory = 'rec';
        break;
    }

    if (category != expectedCategory) {
      setState(() {
        category = expectedCategory;
      });
      context
          .read<MissionBloc>()
          .add(LoadHabitsEvent(category: expectedCategory));
    }
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) => _ensureCategorySync());

    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: AppStrings.habitChallengeText,
        backgroundColor: AppColors.mintColor,
        titleColor: AppColors.whiteColor,
        textColor: AppColors.whiteColor,
        onLeading: true,
      ),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              color: AppColors.mintColor,
            ),
            height: MediaQuery.of(context).size.height * 0.15,
          ),
          Column(
            children: [
              TabBar(
                controller: _tabController,
                isScrollable: false,
                labelPadding: const EdgeInsets.symmetric(horizontal: 4),
                padding: EdgeInsets.zero,
                dividerColor: Colors.transparent,
                labelColor: AppColors.whiteColor,
                unselectedLabelColor: AppColors.mintTabTextGrayColor,
                indicatorColor: AppColors.whiteColor,
                labelStyle: Theme.of(context).textTheme.titleSmall,
                tabs: const [
                  Tab(text: AppStrings.suggestText),
                  Tab(text: AppStrings.eatingText),
                  Tab(text: AppStrings.exerciseText),
                  Tab(text: AppStrings.sleepText),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    BlocConsumer<MissionBloc, MissionState>(
                      listenWhen: (previous, current) {
                        // เฉพาะเมื่อเปลี่ยนจาก state อื่นเป็น ActiveHabitLoaded หรือ HabitLoaded
                        return (previous is! HabitLoaded &&
                                current is HabitLoaded) ||
                            (previous is! ActiveHabitLoaded &&
                                current is ActiveHabitLoaded);
                      },
                      listener: (context, state) {
                        // อาจใส่ logic เพิ่มเติมถ้าต้องการ
                      },
                      buildWhen: (previous, current) {
                        // สร้าง UI ใหม่เฉพาะเมื่อมีการเปลี่ยนแปลงที่สำคัญ
                        if (current is HabitLoading) return true;
                        if (current is HabitLoaded) return true;
                        if (current is HabitError) return true;

                        // ถ้าเป็น ActiveHabitLoaded ที่มี habits สร้าง UI ใหม่
                        if (current is ActiveHabitLoaded &&
                            current.habits != null) return true;

                        // กรณีอื่นๆ ไม่ต้องสร้าง UI ใหม่
                        return false;
                      },
                      builder: (context, state) {
                        if (state is HabitLoading) {
                          return const Center(
                              child: CircularProgressIndicator());
                        }

                        // Get habits from either state
                        HabitRequestModel? habitsData;
                        if (state is HabitLoaded) {
                          habitsData = state.habits;
                        } else if (state is ActiveHabitLoaded &&
                            state.habits != null) {
                          habitsData = state.habits;
                        }

                        if (habitsData != null) {
                          final habits = habitsData.habits;
                          // Sort habits: active first, then by expReward (descending)
                          habits.sort((a, b) {
                            // First sort by isActive (active habits come first)
                            if (a.isActive != b.isActive) {
                              return b.isActive ? 1 : -1;
                            }
                            return a.expReward.compareTo(b.expReward);
                          });

                          return ListView.builder(
                            itemCount: habits.length,
                            itemBuilder: (context, index) {
                              final habit = habits[index];
                              return TaskList(
                                imagePath: habit.thumbnailUrl,
                                taskId: habit.hid,
                                taskName: habit.title,
                                expReward: habit.expReward,
                                defaultDailyMinuteGoal:
                                    habit.defaultDailyMinuteGoal,
                                defaultDaysGoal: habit.defaultDaysGoal,
                                adviceText: habit.advice,
                                challengeId: habit.challengeInfo?.challengeId,
                                progressPercentage:
                                    habit.challengeInfo?.percentageProgress ??
                                        0.0,
                                isActive: habit.isActive,
                                category: habit.category,
                                tabIndex: _currentTabIndex,
                              );
                            },
                          );
                        }

                        return Container();
                      },
                    ),
                    BlocConsumer<MissionBloc, MissionState>(
                      listenWhen: (previous, current) {
                        // เฉพาะเมื่อเปลี่ยนจาก state อื่นเป็น ActiveHabitLoaded หรือ HabitLoaded
                        return (previous is! HabitLoaded &&
                                current is HabitLoaded) ||
                            (previous is! ActiveHabitLoaded &&
                                current is ActiveHabitLoaded);
                      },
                      listener: (context, state) {
                        // อาจใส่ logic เพิ่มเติมถ้าต้องการ
                      },
                      buildWhen: (previous, current) {
                        // สร้าง UI ใหม่เฉพาะเมื่อมีการเปลี่ยนแปลงที่สำคัญ
                        if (current is HabitLoading) return true;
                        if (current is HabitLoaded) return true;
                        if (current is HabitError) return true;

                        // ถ้าเป็น ActiveHabitLoaded ที่มี habits สร้าง UI ใหม่
                        if (current is ActiveHabitLoaded &&
                            current.habits != null) return true;

                        // กรณีอื่นๆ ไม่ต้องสร้าง UI ใหม่
                        return false;
                      },
                      builder: (context, state) {
                        if (state is HabitLoading) {
                          return const Center(
                              child: CircularProgressIndicator());
                        }

                        // Get habits from either state
                        HabitRequestModel? habitsData;
                        if (state is HabitLoaded) {
                          habitsData = state.habits;
                        } else if (state is ActiveHabitLoaded &&
                            state.habits != null) {
                          habitsData = state.habits;
                        }

                        if (habitsData != null) {
                          final habits = habitsData.habits;
                          // Sort habits: active first, then by expReward (descending)
                          habits.sort((a, b) {
                            // First sort by isActive (active habits come first)
                            if (a.isActive != b.isActive) {
                              return b.isActive ? 1 : -1;
                            }
                            return a.expReward.compareTo(b.expReward);
                          });

                          return ListView.builder(
                            itemCount: habits.length,
                            itemBuilder: (context, index) {
                              final habit = habits[index];
                              return TaskList(
                                imagePath: habit.thumbnailUrl,
                                taskId: habit.hid,
                                taskName: habit.title,
                                expReward: habit.expReward,
                                defaultDailyMinuteGoal:
                                    habit.defaultDailyMinuteGoal,
                                defaultDaysGoal: habit.defaultDaysGoal,
                                adviceText: habit.advice,
                                challengeId: habit.challengeInfo?.challengeId,
                                progressPercentage:
                                    habit.challengeInfo?.percentageProgress ??
                                        0.0,
                                isActive: habit.isActive,
                                category: habit.category,
                                tabIndex:
                                    _currentTabIndex, // Pass the current tab index
                              );
                            },
                          );
                        }

                        return Container();
                      },
                    ),
                    BlocConsumer<MissionBloc, MissionState>(
                      listenWhen: (previous, current) {
                        // เฉพาะเมื่อเปลี่ยนจาก state อื่นเป็น ActiveHabitLoaded หรือ HabitLoaded
                        return (previous is! HabitLoaded &&
                                current is HabitLoaded) ||
                            (previous is! ActiveHabitLoaded &&
                                current is ActiveHabitLoaded);
                      },
                      listener: (context, state) {
                        // อาจใส่ logic เพิ่มเติมถ้าต้องการ
                      },
                      buildWhen: (previous, current) {
                        // สร้าง UI ใหม่เฉพาะเมื่อมีการเปลี่ยนแปลงที่สำคัญ
                        if (current is HabitLoading) return true;
                        if (current is HabitLoaded) return true;
                        if (current is HabitError) return true;

                        // ถ้าเป็น ActiveHabitLoaded ที่มี habits สร้าง UI ใหม่
                        if (current is ActiveHabitLoaded &&
                            current.habits != null) return true;

                        // กรณีอื่นๆ ไม่ต้องสร้าง UI ใหม่
                        return false;
                      },
                      builder: (context, state) {
                        if (state is HabitLoading) {
                          return const Center(
                              child: CircularProgressIndicator());
                        }

                        // Get habits from either state
                        HabitRequestModel? habitsData;
                        if (state is HabitLoaded) {
                          habitsData = state.habits;
                        } else if (state is ActiveHabitLoaded &&
                            state.habits != null) {
                          habitsData = state.habits;
                        }

                        if (habitsData != null) {
                          final habits = habitsData.habits;
                          // Sort habits: active first, then by expReward (descending)
                          habits.sort((a, b) {
                            // First sort by isActive (active habits come first)
                            if (a.isActive != b.isActive) {
                              return b.isActive ? 1 : -1;
                            }
                            return a.expReward.compareTo(b.expReward);
                          });

                          return ListView.builder(
                            itemCount: habits.length,
                            itemBuilder: (context, index) {
                              final habit = habits[index];
                              return TaskList(
                                imagePath: habit.thumbnailUrl,
                                taskId: habit.hid,
                                taskName: habit.title,
                                expReward: habit.expReward,
                                defaultDailyMinuteGoal:
                                    habit.defaultDailyMinuteGoal,
                                defaultDaysGoal: habit.defaultDaysGoal,
                                adviceText: habit.advice,
                                challengeId: habit.challengeInfo?.challengeId,
                                progressPercentage:
                                    habit.challengeInfo?.percentageProgress ??
                                        0.0,
                                isActive: habit.isActive,
                                category: habit.category,
                                tabIndex:
                                    _currentTabIndex, // Pass the current tab index
                              );
                            },
                          );
                        }

                        return Container();
                      },
                    ),
                    BlocConsumer<MissionBloc, MissionState>(
                      listenWhen: (previous, current) {
                        // เฉพาะเมื่อเปลี่ยนจาก state อื่นเป็น ActiveHabitLoaded หรือ HabitLoaded
                        return (previous is! HabitLoaded &&
                                current is HabitLoaded) ||
                            (previous is! ActiveHabitLoaded &&
                                current is ActiveHabitLoaded);
                      },
                      listener: (context, state) {
                        // อาจใส่ logic เพิ่มเติมถ้าต้องการ
                      },
                      buildWhen: (previous, current) {
                        // สร้าง UI ใหม่เฉพาะเมื่อมีการเปลี่ยนแปลงที่สำคัญ
                        if (current is HabitLoading) return true;
                        if (current is HabitLoaded) return true;
                        if (current is HabitError) return true;

                        // ถ้าเป็น ActiveHabitLoaded ที่มี habits สร้าง UI ใหม่
                        if (current is ActiveHabitLoaded &&
                            current.habits != null) return true;

                        // กรณีอื่นๆ ไม่ต้องสร้าง UI ใหม่
                        return false;
                      },
                      builder: (context, state) {
                        if (state is HabitLoading) {
                          return const Center(
                              child: CircularProgressIndicator());
                        }

                        // Get habits from either state
                        HabitRequestModel? habitsData;
                        if (state is HabitLoaded) {
                          habitsData = state.habits;
                        } else if (state is ActiveHabitLoaded &&
                            state.habits != null) {
                          habitsData = state.habits;
                        }

                        if (habitsData != null) {
                          final habits = habitsData.habits;
                          // Sort habits: active first, then by expReward (descending)
                          habits.sort((a, b) {
                            // First sort by isActive (active habits come first)
                            if (a.isActive != b.isActive) {
                              return b.isActive ? 1 : -1;
                            }
                            return a.expReward.compareTo(b.expReward);
                          });

                          return ListView.builder(
                            itemCount: habits.length,
                            itemBuilder: (context, index) {
                              final habit = habits[index];
                              return TaskList(
                                imagePath: habit.thumbnailUrl,
                                taskId: habit.hid,
                                taskName: habit.title,
                                expReward: habit.expReward,
                                defaultDailyMinuteGoal:
                                    habit.defaultDailyMinuteGoal,
                                defaultDaysGoal: habit.defaultDaysGoal,
                                adviceText: habit.advice,
                                challengeId: habit.challengeInfo?.challengeId,
                                progressPercentage:
                                    habit.challengeInfo?.percentageProgress ??
                                        0.0,
                                isActive: habit.isActive,
                                category: habit.category,
                                tabIndex:
                                    _currentTabIndex, // Pass the current tab index
                              );
                            },
                          );
                        }

                        return Container();
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

extension ObjectExt<T> on T {
  T also(void Function(T) action) {
    action(this);
    return this;
  }
}
