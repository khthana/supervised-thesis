class HealthAssessmentHealthDataRequestModel {
  final double? diastolicBloodPressure;
  final double? systolicBloodPressure;
  final double? hdl;
  final double? ldl;
  final double? waistLine;
  final int? hypertension;
  final int? diabetes;
  final int? dyslipidemia;
  final int? obesity;
  final bool? hasSmoke;
  final bool? hasDrink;

  HealthAssessmentHealthDataRequestModel(
      {this.diastolicBloodPressure,
      this.systolicBloodPressure,
      this.hdl,
      this.ldl,
      this.waistLine,
      this.hypertension,
      this.diabetes,
      this.dyslipidemia,
      this.obesity,
      this.hasDrink,
      this.hasSmoke});

  HealthAssessmentHealthDataRequestModel copyWith({
    double? diastolicBloodPressure,
    double? systolicBloodPressure,
    double? hdl,
    double? ldl,
    double? waistLine,
    int? hypertension,
    int? diabetes,
    int? dyslipidemia,
    int? obesity,
    bool? hasSmoke,
    bool? hasDrink,
  }) {
    return HealthAssessmentHealthDataRequestModel(
      diastolicBloodPressure:
          diastolicBloodPressure ?? this.diastolicBloodPressure,
      systolicBloodPressure:
          systolicBloodPressure ?? this.systolicBloodPressure,
      hdl: hdl ?? this.hdl,
      ldl: ldl ?? this.ldl,
      waistLine: waistLine ?? this.waistLine,
      hypertension: hypertension ?? this.hypertension,
      diabetes: diabetes ?? this.diabetes,
      dyslipidemia: dyslipidemia ?? this.dyslipidemia,
      obesity: obesity ?? this.obesity,
      hasSmoke: hasSmoke ?? this.hasSmoke,
      hasDrink: hasDrink ?? this.hasDrink,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'DIASTOLIC_BLOOD_PRESSURE': diastolicBloodPressure,
      'SYSTOLIC_BLOOD_PRESSURE': systolicBloodPressure,
      'HDL': hdl,
      'LDL': ldl,
      'WAIST_LINE': waistLine,
      'HYPERTENSION': hypertension,
      'DIABETES': diabetes,
      'DYSLIPIDEMIA': dyslipidemia,
      'OBESITY': obesity,
      'HAS_SMOKE': hasSmoke,
      'HAS_DRINK': hasDrink,
    };
  }

  factory HealthAssessmentHealthDataRequestModel.fromJson(
      Map<String, dynamic> json) {
    return HealthAssessmentHealthDataRequestModel(
      diastolicBloodPressure:
          (json['DIASTOLIC_BLOOD_PRESSURE'] as num?)?.toDouble() ?? 0.0,
      systolicBloodPressure:
          (json['SYSTOLIC_BLOOD_PRESSURE'] as num?)?.toDouble() ?? 0.0,
      hdl: (json['HDL'] as num?)?.toDouble() ?? 0.0,
      ldl: (json['LDL'] as num?)?.toDouble() ?? 0.0,
      waistLine: (json['WAIST_LINE'] as num?)?.toDouble() ?? 0.0,
      hypertension: json['HYPERTENSION'] as int? ?? 0,
      diabetes: json['DIABETES'] as int? ?? 0,
      dyslipidemia: json['DYSLIPIDEMIA'] as int? ?? 0,
      obesity: json['OBESITY'] as int? ?? 0,
      hasSmoke: json['HAS_SMOKE'] as bool? ?? false,
      hasDrink: json['HAS_DRINK'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toEditLogsRequestJson(String isShowToEmployee) {
    return {
      'DIASTOLIC_BLOOD_PRESSURE': diastolicBloodPressure,
      'SYSTOLIC_BLOOD_PRESSURE': systolicBloodPressure,
      'HDL': hdl,
      'LDL': ldl,
      'WAIST_LINE': waistLine,
      'HYPERTENSION': hypertension,
      'DIABETES': diabetes,
      'DYSLIPIDEMIA': dyslipidemia,
      'OBESITY': obesity,
      'HAS_SMOKE': hasSmoke,
      'HAS_DRINK': hasDrink,
    };
  }
}
