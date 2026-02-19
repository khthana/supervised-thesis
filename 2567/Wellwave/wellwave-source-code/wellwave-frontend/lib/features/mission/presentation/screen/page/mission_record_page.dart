import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/features/mission/data/repositories/habit_repositories.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/success_dialog.dart';

class MissionRecordPage extends StatefulWidget {
  final String title;
  final int hid;
  final int challengeId;
  final String adviceText;
  final int minutesGoal;
  final int expReward;

  const MissionRecordPage({
    super.key,
    required this.title,
    required this.hid,
    required this.challengeId,
    required this.adviceText,
    required this.minutesGoal,
    required this.expReward,
  });

  @override
  _MissionRecordPageState createState() => _MissionRecordPageState();
}

class _MissionRecordPageState extends State<MissionRecordPage> {
  StreamController<int>? _timerController;
  bool _isRunning = true;
  int _lastElapsedSeconds = 0;
  String? selectedMood;

  @override
  void initState() {
    super.initState();

    _startTimer();
  }

  void _startTimer() {
    _timerController = StreamController<int>();
    Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_isRunning && !_timerController!.isClosed) {
        _lastElapsedSeconds++;
        _timerController!.add(_lastElapsedSeconds);
      }
    });
  }

  void _stopTimer() {
    setState(() {
      _isRunning = false;
    });
  }

  void _resumeTimer() {
    setState(() {
      _isRunning = true;
    });
  }

  void _completeTimer() async {
    final int elapsedMinutes = _lastElapsedSeconds ~/ 60;
    final bool isCompleted = elapsedMinutes >= widget.minutesGoal;

    if (!isCompleted) {
      _stopTimer();
      showDialog(
        context: context,
        barrierDismissible: false,
        barrierColor: Colors.black.withOpacity(0.8),
        builder: (context) => Stack(
          children: [
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.whiteColor,
                        borderRadius: BorderRadius.circular(16),
                        border: const Border(
                          bottom: BorderSide(
                            color: AppColors.popUpSkyBlueColor,
                            width: 8.0,
                          ),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(height: 124),
                            Text(
                              'ยังไม่สำเร็จเลยนะ!',
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineLarge
                                  ?.copyWith(color: AppColors.blackColor),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8.0),
                            Text(
                              'เป้าหมายของคุณคือ ${widget.minutesGoal} นาที\nคุณทำได้ $elapsedMinutes นาที',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyMedium
                                  ?.copyWith(color: AppColors.blackColor),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 24.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    Navigator.of(context).pop();
                                  },
                                  child: Text(
                                    'ออก',
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.copyWith(color: AppColors.greyColor),
                                  ),
                                ),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primaryColor,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 36, vertical: 12),
                                  ),
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    _resumeTimer();
                                  },
                                  child: Text(
                                    'ทำต่อ',
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.copyWith(color: AppColors.whiteColor),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              top: MediaQuery.of(context).size.height / 2 - 230,
              left: 0,
              right: 0,
              child: SvgPicture.asset(
                AppImages.keepGoingAvatar,
                height: 178.0,
              ),
            ),
          ],
        ),
      );
      return;
    }

    _submitRecord(isCompleted);
  }

  void _submitRecord(bool isCompleted) async {
    _isRunning = false;
    final trackDate = DateTime.now().toUtc().toIso8601String();

    final double elapsedMinutesDouble = _lastElapsedSeconds / 60;
    final int elapsedMinutes = elapsedMinutesDouble.round();

    try {
      context.read<MissionBloc>().add(
            SubmitDailyTrackEvent(
              challengeId: widget.challengeId,
              durationMinutes: elapsedMinutes,
              trackDate: trackDate,
              completed: isCompleted,
            ),
          );

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => const Center(child: CircularProgressIndicator()),
      );

      await Future.delayed(const Duration(seconds: 2));

      final statsData =
          await context.read<HabitRepositories>().getStat(widget.challengeId);

      if (statsData != null) {
        final bool isFinished = (statsData.status == 'completed' ||
            statsData.progressPercentage == 100);

        if (!mounted) return;
        Navigator.of(context).pop();

        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => BlocBuilder<MissionBloc, MissionState>(
            builder: (context, state) {
              print('state ${state}');
              if (state is DailyTrackSuccess) {
                return SuccessHabitDialog(
                  timeTaken: formatTime(_lastElapsedSeconds),
                  calorieReward: statsData.dailyTracks.isNotEmpty
                      ? statsData.dailyTracks.last.caloriesBurned ?? 0
                      : 0,
                  expReward: widget.expReward,
                  isFinished: isFinished,
                  trackId: state.trackId,
                  onMoodSelected: (String mood) {
                    setState(() {
                      selectedMood = mood;
                    });
                  },
                );
              }
              return const Center(child: CircularProgressIndicator());
            },
          ),
        );
      }
    } catch (e) {
      debugPrint('Error in _submitRecord: $e');
      if (!mounted) return;
      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _timerController?.close();
    super.dispose();
  }

  String formatTime(int seconds) {
    int hours = seconds ~/ 3600;
    int minutes = (seconds % 3600) ~/ 60;
    int secs = seconds % 60;
    return "${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}";
  }

  double calculateProgress(int elapsedSeconds) {
    if (widget.minutesGoal <= 0) return 0.0;

    double totalProgress = elapsedSeconds / (widget.minutesGoal * 60.0);
    return totalProgress;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: '',
        backgroundColor: AppColors.whiteColor,
        titleColor: AppColors.blackColor,
        textColor: AppColors.blackColor,
        onLeading: false,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Text(
              '${widget.title}',
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: StreamBuilder<int>(
              stream: _timerController?.stream,
              builder: (context, snapshot) {
                int elapsedSeconds = snapshot.data ?? 0;
                double totalProgress = calculateProgress(elapsedSeconds);
                int completedCycles = widget.minutesGoal > 0
                    ? elapsedSeconds ~/ (widget.minutesGoal * 60)
                    : 0;
                String timeString = formatTime(elapsedSeconds);

                List<Color> colors = [
                  AppColors.mintColor,
                  AppColors.skyBlueColor,
                ];

                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (completedCycles >= 1) ...[
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.local_fire_department_rounded,
                            color: AppColors.redLevelColor,
                            size: 24,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'ครบเป้าหมายแล้ว!',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: AppColors.darkGrayColor,
                                ),
                          ),
                        ],
                      ),
                    ] else ...[
                      Text(
                        '',
                      ),
                    ],
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          height: 250,
                          width: 250,
                          margin: const EdgeInsets.symmetric(vertical: 24),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.lightgrayColor,
                          ),
                        ),
                        Container(
                          width: 180,
                          height: 180,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                spreadRadius: 0,
                                blurRadius: 2,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'ระยะเวลา',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.blackColor,
                                      ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  timeString,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleLarge
                                      ?.copyWith(
                                        color: AppColors.blackColor,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Container(
                          height: 250,
                          width: 250,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.transparent,
                          ),
                          child: TweenAnimationBuilder<double>(
                            tween: Tween<double>(begin: 0, end: totalProgress),
                            duration: const Duration(milliseconds: 500),
                            builder: (context, value, _) {
                              return CustomPaint(
                                painter: CircularProgressPainter(
                                  progress: value,
                                  strokeWidth: 36.0,
                                  color:
                                      colors[completedCycles % colors.length],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 48.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    spreadRadius: 0,
                                    blurRadius: 2,
                                    offset: const Offset(0, 1),
                                  ),
                                ],
                              ),
                              child: ElevatedButton(
                                onPressed: () {
                                  if (_isRunning) {
                                    _stopTimer();
                                  } else {
                                    _resumeTimer();
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.whiteColor,
                                  foregroundColor: AppColors.whiteColor,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 16),
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    side: BorderSide(
                                      color: Colors.black.withOpacity(0.1),
                                      width: 1,
                                    ),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SvgPicture.asset(
                                      _isRunning
                                          ? AppImages.stopMissionRecordIcon
                                          : AppImages.resumeMissionRecordIcon,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _isRunning ? 'หยุดพัก' : 'ทำต่อ',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(
                                            color: AppColors.blackColor,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    spreadRadius: 0,
                                    blurRadius: 2,
                                    offset: const Offset(0, 1),
                                  ),
                                ],
                              ),
                              child: ElevatedButton(
                                onPressed: _completeTimer,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.whiteColor,
                                  foregroundColor: AppColors.whiteColor,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 16),
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    side: BorderSide(
                                      color: Colors.black.withOpacity(0.1),
                                      width: 1,
                                    ),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SvgPicture.asset(
                                      AppImages.finishMissionRecordIcon,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'เสร็จสิ้น',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(
                                            color: AppColors.blackColor,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Padding(
                      padding: const EdgeInsets.all(36.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(40),
                            child: SvgPicture.asset(
                              AppImages.missionRecommendTextIcon,
                              width: 76,
                              height: 76,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'คำแนะนำ',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium
                                      ?.copyWith(
                                        color: AppColors.blackColor,
                                      ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  widget.adviceText,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(
                                        color: AppColors.blackColor,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CircularProgressPainter extends CustomPainter {
  final double progress;
  final double strokeWidth;
  final Color color;

  CircularProgressPainter({
    required this.progress,
    required this.strokeWidth,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    int fullCircles = progress.floor();
    double remainingProgress = progress - fullCircles;

    final gradient = SweepGradient(
      colors: [
        const Color.fromARGB(255, 56, 77, 207),
        const Color.fromARGB(255, 56, 196, 194),
        const Color.fromARGB(255, 56, 77, 207),
        const Color.fromARGB(255, 56, 196, 194),
        const Color.fromARGB(255, 56, 77, 207),
      ],
      stops: const [
        0.0,
        0.25,
        0.5,
        0.75,
        1.0,
      ],
      transform: GradientRotation(-1.5708),
      tileMode: TileMode.mirror,
    );

    for (int i = 0; i < fullCircles; i++) {
      canvas.drawCircle(
        center,
        radius,
        Paint()
          ..shader = gradient.createShader(
            Rect.fromCircle(center: center, radius: radius),
          )
          ..style = PaintingStyle.stroke
          ..strokeWidth = strokeWidth
          ..strokeCap = StrokeCap.round,
      );
    }

    if (remainingProgress > 0) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        -1.5708,
        remainingProgress * 2 * pi,
        false,
        Paint()
          ..shader = gradient.createShader(
            Rect.fromCircle(center: center, radius: radius),
          )
          ..style = PaintingStyle.stroke
          ..strokeWidth = strokeWidth
          ..strokeCap = StrokeCap.round,
      );
    }

    final totalAngle = (remainingProgress * 2 * pi) + (fullCircles * 2 * pi);

    final endPoint = Offset(
      center.dx + radius * cos(-1.5708 + totalAngle),
      center.dy + radius * sin(-1.5708 + totalAngle),
    );

    final dotSize = strokeWidth * 0.6;

    canvas.drawCircle(
      endPoint,
      dotSize,
      Paint()
        ..color = Colors.black.withOpacity(0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3)
        ..style = PaintingStyle.fill,
    );

    canvas.drawCircle(
      endPoint,
      dotSize,
      Paint()
        ..color = const Color.fromARGB(255, 56, 77, 207)
        ..shader = RadialGradient(
          colors: [
            const Color.fromARGB(255, 28, 45, 160),
            const Color.fromARGB(255, 28, 45, 160),
          ],
          stops: const [0.5, 1.0],
        ).createShader(
          Rect.fromCircle(center: endPoint, radius: dotSize),
        )
        ..style = PaintingStyle.fill,
    );

    canvas.save();
    canvas.translate(endPoint.dx, endPoint.dy);

    final icon = Icons.local_fire_department;
    final textPainter = TextPainter(
      text: TextSpan(
        text: String.fromCharCode(icon.codePoint),
        style: TextStyle(
          fontSize: dotSize * 1.5,
          fontFamily: icon.fontFamily,
          color: Colors.white,
        ),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(
      canvas,
      Offset(
        -textPainter.width / 2,
        -textPainter.height / 2,
      ),
    );

    canvas.restore();
  }

  @override
  bool shouldRepaint(CircularProgressPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
