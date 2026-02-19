import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_strings.dart';
import '../bloc/noti_bloc.dart';
import '../widget/water_plan.dart';

class DrinkPlanScreen extends StatefulWidget {
  const DrinkPlanScreen({super.key});
  @override
  State<DrinkPlanScreen> createState() => _DrinkPlanScreenState();
}

class _DrinkPlanScreenState extends State<DrinkPlanScreen> {
  bool _isSwitched = false;
  final _secureStorage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    BlocProvider.of<NotiBloc>(context).add(FetchDrinkPlanEvent());
  }

  Future<void> _toggleSwitch(bool value) async {
    final uid = await _secureStorage.read(key: 'user_uid');
    if (uid == null) {
      throw Exception("No access uid found");
    }

    if (_isSwitched != value) {
      setState(() {
        _isSwitched = value;
      });

      context.read<NotiBloc>().add(
          UpdateDrinkPlanEvent(uid: int.parse(uid), isActive: _isSwitched));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<NotiBloc, NotiState>(
      listener: (context, state) {
        if (state is NotiLoadedState && state.drinkPlanState != null) {
          setState(() {
            _isSwitched = state.drinkPlanState!.isActive;
          });
        }
      },
      child: BlocBuilder<NotiBloc, NotiState>(
        builder: (context, state) {
          return Scaffold(
            backgroundColor: AppColors.backgroundColor,
            appBar: CustomAppBar(title: '', context: context, onLeading: true),
            body: SingleChildScrollView(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          AppStrings.drinkPlanText,
                          style: Theme.of(context)
                              .textTheme
                              .headlineMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        Switch(
                          value: _isSwitched,
                          onChanged: (value) {
                            _toggleSwitch(value);
                          },
                          activeColor: Colors.white, // Circle color (active)
                          activeTrackColor:
                              const Color(0xFF34C759), // Track color (active)
                          inactiveThumbColor:
                              AppColors.whiteColor, // Circle color (inactive)
                          inactiveTrackColor:
                              AppColors.darkGrayColor, // Track color (inactive)
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),
                    if (_isSwitched) const WaterPlanWidget(),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
