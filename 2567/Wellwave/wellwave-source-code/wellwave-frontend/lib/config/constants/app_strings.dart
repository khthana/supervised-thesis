class AppStrings {
  static String uppercaseFirst(String text) {
    if (text.isEmpty) return text; // Handle empty string case
    return text[0].toUpperCase() + text.substring(1);
  }

  static const emptyText = '';

  //logs screen
  static const historyText = 'ประวัติ';
  static const dailyLogsText = 'บันทึกสุขภาพประจำวัน';
  static const amoutOfWaterText = 'จำนวนน้ำ';
  static const glassesText = 'แก้ว';
  static const hoursOfSleepText = 'ชั่วโมงการนอน';
  static const hoursText = 'ชั่วโมง';
  static const shortHoursText = 'ชม.';
  static const weeklyLogsText = 'บันทึกสุขภาพประจำสัปดาห์';
  static const hdlText = 'HDL';
  static const ldlText = 'LDL';
  static const hdlReText = 'คอเลสเตอรอลชนิดดี (HDL)';
  static const ldlReText = 'คอเลสเตอรอลชนิดไม่ดี (LDL)';
  static const mgPerDlText = 'มก./ดล';
  static const confirmText = 'ยืนยัน';
  static const weightRecordText = 'บันทึกค่าน้ำหนัก';
  static const kgText = 'กก.';
  static const waistLineRecordText = 'บันทึกรอบเอว';
  static const cmText = 'ซม.';
  static const hdlRecordText = 'บันทึกค่า HDL';
  static const ldlRecordText = 'บันทึกค่า LDL';
  static const chooseMoodsText = 'คุณรู้สึกอย่างไรกับภารกิจ';
  static const dataRecordingText = 'บันทึกข้อมูล';
  static const dataRecordingCompletedText = 'บันทึกข้อมูลเสร็จสิ้น';
  static const nextText = 'ถัดไป';
  static const cancleText = 'ยกเลิก';
  static const completedText = 'เสร็จสิ้น';
  static const skipText = 'ข้าม';
  static const backText = 'ย้อนกลับ';

  //logs history screen
  static const healthHistoryText = 'ประวัติบันทึกสุขภาพ';
  static const sleepText = 'การนอน';
  static const stepText = 'ก้าว';
  static const stepWalkText = 'ก้าวเดิน';
  static const drinkText = 'ดื่มน้ำ';
  static const enterText = 'เข้าสู่แอพ';
  static const waistLineText = 'รอบเอว';
  static const xDateText = 'วันที่';
  static const goodCriteria = 'ค่าตามเกณฑ์';
  static const aboveCriteria = 'ค่าเกินเกณฑ์';
  static const underCriteria = 'ค่าต่ำกว่าเกณฑ์';

  //profile screen
  static const userNameText = 'ชื่อผู้ใช้';
  static const idText = 'ไอดี';
  static const leagueText = 'ระดับ';
  static const firstLeaugeText = 'มือใหม่สุขภาพดี';
  static const secondLeaugeText = 'ผู้เสาะหาความแข็งแรง';
  static const thirdLeaugeText = 'ยอดนักรบสุดฟิต';
  static const forthLeaugeText = 'ปรมาจารย์ด้านสุขภาพ';
  static const fifthLeaugeText = 'ตำนานแชมป์สุดแข็งแกร่ง';
  static const gemText = 'gem';
  static const expText = 'exp';
  static const checkinText = 'เช็คอินเพื่อสะสมคะแนน';
  static const archeivementText = 'ความสำเร็จ';
  static const archeiveText = 'สำเร็จ';
  static const seeAllText = 'ดูทั้งหมด';
  static const dayText = 'วัน';
  static const googleConnectText = 'Google Connect';
  static const signOutText = 'ออกจากระบบ';
  static const rewardRedeemText = 'แลกรางวัล';
  static const progressText = 'ความก้าวหน้า';
  static const exerciseProgressText = 'ออกกำลังกายไปแล้ว';
  static const copyToClipboardText = 'คัดลอกไปยังคลิปบอร์ด';

  static const taskProgressText = 'จำนวนทำภารกิจ';
  static const taskText = 'ภารกิจ';
  static const minuteText = 'นาที';
  static const alertText = 'แจ้งเตือน';
  static const youReceivedText = 'คุณได้รับ';
  static const closeWindowText = 'ปิดหน้าต่างนี้';
  static const genderText = 'เพศ';
  static const birthYearText = 'ปีเกิด';
  static const heightText = 'ส่วนสูง';

  static const metabolicSyndromeText = 'ภาวะเมตาบอลิกซินโดรม';
  static const metabolicDescriptionText =
      'คือ ภาวะที่เกิดจากระบบการเผาผลาญของร่างกาย ทำงานผิดปกติไป ทำให้เกิดการอ้วนลงพุง น้ำหนักตัว เกินมาตรฐาน น้ำตาลในเลือดสูง ความดันโลหิตสูง';
  static const metaEffectText = 'ผลกระทบของโรค';
  static const metaEffectDescriptionText =
      'ภาวะนี้ส่งผลกระทบต่อคุณภาพชีวิตของผู้ป่วยในหลากหลายด้าน เช่น ความเสี่ยงในการเกิดโรคหัวใจ และหลอดเลือด เนื่องจากทำให้หลอดเลือดแดงอุดตัน ';
  static const metaBehaviorText = 'การปรับพฤติกรรม';
  static const metaBehaviorDescriptionText =
      'โดยการรับประทานอาหารที่เหมาะสม ออกกำลังกายอย่างสม่ำเสมอ โดย WellWave จะเป็นตัวช่วยสำคัญในการปรับพฤติกรรมของคุณ ';

  static const leagueList = [
    AppStrings.firstLeaugeText,
    AppStrings.secondLeaugeText,
    AppStrings.thirdLeaugeText,
    AppStrings.forthLeaugeText,
    AppStrings.fifthLeaugeText,
  ];

  //arcievement
  static const yourRecordText = 'สถิติของคุณ';
  static const medalText = 'เหรียญรางวัล';
  static const haveNoAchievementYet = 'ยังไม่ได้รับเหรียญความสำเร็จ';

  //notification
  static const selectAllText = 'เลือกทั้งหมด';
  static const deselectAllText = 'ปิดทั้งหมด';
  static const drinkingText = 'การดื่มน้ำ';
  static const timeText = 'เวลา';
  static const setTimeText = 'ตั้งเวลา';
  static const startTimeText = 'เวลาเริ่ม';
  static const endTimeText = 'เวลาจบ';
  static const notiEveryText = 'แจ้งเตือนทุก';
  static const setDrinkPlanText = 'กำหนดแผนดื่มน้ำโดยละเอียด >';
  static const sleepingText = 'การเข้านอน';
  static const drinkPlanText = 'แผนการดื่มน้ำ';

  //Chart
  static const errorShow = 'Error';
  static const noLogsAvailableText = 'ไม่มีข้อมูลที่บันทึก';
  static const errorLoadingLogsText = 'เกิดข้อผิดพลาดในการดึงข้อมูลที่บันทึก';
  static const noDataForTodayText = 'ไม่มีข้อมูลสำหรับวันนี้';
  static const noDataForWeekText = 'ไม่มีข้อมูลสำหรับสัปดาห์นี้';
  static const stepNumber = 'ขั้นตอนที่';
  static const weightLogText = 'WEIGHT_LOG';
  static const waistLineLogText = 'WAIST_LINE_LOG';
  static const hdlLogText = 'HDL_LOG';
  static const ldlLogText = 'LDL_LOG';
  static const stepLogText = 'STEP_LOG';
  static const sleepLogText = 'SLEEP_LOG';
  static const drinkLogText = 'DRINK_LOG';

  static const amoutOfStepText = 'จำนวนก้าวเดิน';
  static const goalText = 'เป้าหมาย';

  static const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];

  //goal
  static const goalAmountText = 'จำนวนเป้าหมาย';
  static const stepPerWeekText = 'ก้าวเดินต่อสัปดาห์';
  static const exercisePerWeekText = 'ออกกำลังกายต่อสัปดาห์';

  static const noDataAvaliableText = 'ไม่มีข้อมูล';
  static const clickToEditText = 'กดเพื่อแก้ไข';

  //leaderboard
  static const leaderboardText = 'กระดานจัดอันดับ';
  static const healthAssessmentText = 'แบบประเมินสุขภาพ';
  static const youNotInLeagueYet = 'คุณยังไม่ได้เข้าร่วมการแข่งขัน';

  //home
  static const stepTimeMessageLessThanPrevious =
      'สัปดาห์ที่ผ่านมาอาจจะช้าลงบ้าง พักให้หายเหนื่อยแล้วลุยต่อไปนะ!';
  static const stepTimeMessageContinuity =
      'สัปดาห์นี้คุณทำได้ดีมาก! รักษาความต่อเนื่องนี้ไว้และก้าวต่อไป!';

  static const MarkAsReadAllText = 'อ่านทั้งหมด';

  static const riskText = 'เสี่ยง';
  static const lowRiskText = 'เสี่ยงต่ำ';
  static const moderateRiskText = 'เสี่ยงปานกลาง';
  static const highRiskText = 'เสี่ยงสูง';
  static const veryHighRiskText = 'เสี่ยงสูงมาก';
  static const recommendForYouText = 'คำแนะนำสำหรับคุณ';
  static const recommendMuscleText =
      'เพิ่มโปรตีนในแต่ละมื้อ เช่น เนื้อไม่ติดมัน ไข่ หรือผลิตภัณฑ์นม ออกกำลังกายสม่ำเสมอ 3-4 ครั้งต่อสัปดาห์ ครั้งละ 45-60 นาที';
  static const recommendLoseWeightText =
      'ลดอาหารไขมันสูงและคาร์โบไฮเดรตขัดสี เช่น ขนมปังขาว ขนมหวาน ร่วมกับการออกกำลังกาย 3 ครั้งต่อสัปดาห์ ครั้งละ 30-60 นาที';
  static const recommendHealthyText =
      'รับประทานอาหารที่มีคุณค่าทางโภชนาการครบถ้วน เน้นผัก ผลไม้ โปรตีนที่ดี และไขมันดี พร้อมทั้งออกกำลังกายอย่างสม่ำเสมอ';

  static const diabetesText = 'โรคเบาหวาน';
  static const hypertensionText = 'โรคความดันโลหิตสูง';
  static const obesityText = 'โรคอ้วน';
  static const hyperlipidemiaText = 'โรคไขมันในเลือดสูง';
  static const coronaryArteryText = 'โรคหลอดเลือดหัวใจ';
  static const paralysisText = 'โรคอัมพาต';
  static const unknownDiseaseText = 'ไม่ทราบ / ไม่มีประวัติเจ็บป่วย';

  static const setNameandPicText = 'ตั้งชื่อและรูปผู้ใช้';
  static const callNameAskText = 'ต้องการให้เราเรียกคุณว่าอะไรดี';
  static const drinkalcoholAskText = 'คุณดื่มเครื่องดื่มแอลกอฮอล์หรือไม่?';
  static const famhisAskText = 'คนในครอบครัวมีประวัติการเจ็บป่วยเหล่านี้ไหม?';
  static const goalAskText = 'บอกเป้าหมายของคุณให้เรารู้หน่อยได้ไหม?';
  static const connectHealthAskText = 'ต้องการเชื่อมต่อข้อมูลสุขภาพหรือไม่?';
  static const connectHealthDetailsText =
      'เชื่อมต่อกับ Google Fit เพื่อให้การติดตามสุขภาพของคุณแม่นยำยิ่งขึ้น';
  static const healthPlanDetailsText =
      'แผนสุขภาพส่วนตัวของคุณพร้อมแล้ว \nเริ่มต้นการดูแลสุขภาพที่ดีที่สุดสำหรับคุณได้เลย';
  static const healthAssessmentDetailsText =
      'คัดกรองความเสี่ยงในกลุ่มภาวะโรคเมตาบอลิก (เบาหวาน ความดันโลหิตสูง ไขมัน และโรคอ้วน)';
  static const drinkUsuallyText = 'ดื่มเป็นประจำ';
  static const drinkSometimesText = 'ดื่มเป็นครั้งคราว';
  static const smokeUsuallyText = 'สูบเป็นประจำ';
  static const smokeUedtoText = 'เลิกสูบแล้ว';
  static const smokeNeverText = 'ไม่สูบ';

  static const more5timesText = '(เกิน 5 ครั้ง / สัปดาห์)';
  static const less5timesText = '(ไม่เกิน 5 ครั้ง / สัปดาห์)';
  static const drinkUsedtoText = 'เคยดื่มแต่เลิกแล้ว';
  static const drinkNeverText = 'ไม่ดื่มแอลกอฮอล์';
  static const usernameText = 'ชื่อผู้ใช้';
  static const genderMaleText = 'ชาย';
  static const genderFemaleText = 'หญิง';
  static const healthDataText = 'ข้อมูลสุขภาพ';
  static const personalDataText = 'ข้อมูลส่วนตัว';
  static const yearOfBirthText = 'ปีเกิด';
  static const highText = 'ส่วนสูง';
  static const weightText = 'น้ำหนัก';
  static const tellMePersonaText =
      'บอกข้อมูลของคุณให้เราทราบเพื่อผลลัพธ์ที่แม่นยำ';
  static const ifYouKnowText =
      'หากทราบข้อมูล โปรดระบุเพื่อผลลัพธ์ที่แม่นยำยิ่งขึ้น';
  static const goalStepText = 'กำหนดเป้าหมายจำนวนก้าวเดินต่อสัปดาห์';
  static const goalExerciseText = 'กำหนดเป้าหมายจำนวนก้าวเดินต่อสัปดาห์';
  static const stepCountText = 'จำนวนก้าวเดิน';
  static const exCountText = 'เวลาออกกำลังกาย';
  static const recommendText = 'แนะนำ';
  static const systolicBloodPressureText = 'ความดันโลหิตขณะบีบตัว';
  static const diastolicBloodPressureText = 'ความดันโลหิตขณะคลายตัว';
  static const hdlmoreText = 'คอเลสเตอรอลชนิดดี (HDL)';
  static const ldlmoreText = 'คอเลสเตอรอลชนิดไม่ดี (LDL)';

  static const suffixMillimetersText = 'มิลลิเมตรปรอท';
  static const suffixcmText = 'ซม.';
  static const suffixkgText = 'กก.';
  static const suffixmgPerdLText = 'มก./ดล.';
  static const suffixStepText = 'ก้าว';
  static const suffixMinuteText = 'นาที';
  static const goalMuscleText = 'สร้างกล้ามเนื้อ';
  static const goalHealthyText = 'สุขภาพดี';
  static const goalLoseweightText = 'ลดน้ำหนัก';

  static const challengeText = 'พิสูจน์ฝีมือ';
  static const healthdataText = 'ข้อมูลสุขภาพประจำสัปดาห์';

  static const seeMissionText = 'ดูภารกิจ';
  static const doMissionText = 'ทำภารกิจ';
  static const slideMissionText = 'สไลด์เมื่อเสร็จสิ้น';
  static const continueMissionText = 'ทำต่อ';

  static const exerciseText = 'ออกกำลังกาย';
  static const gotoAssessmentPageText = 'เข้าสู่หน้าประเมิน';
  static const timeToAssessmentText = 'ถึงเวลาประเมินสุขภาพอีกครั้ง';
  static const howMuchHaveYouChangedText = 'คุณเปลี่ยนแปลงไปมากแค่ไหนกันนะ?';

  static const resultThisWeekText = 'สรุปผลสัปดาห์ที่ผ่านมา';
  static const greatjobText = 'สุดยอดไปเลย! สัปดาห์นี้ไปกันต่อ~';

  static const noNotiText = 'ยังไม่มีการแจ้งเตือน';
  static const weightAndWaistReAssessmentText = 'อันดับแรก มาเช็กหุ่นกันหน่อย!';
  static const pressureReAssessmentText =
      'มาต่อกันที่ความดัน เดือนนี้เป็นไงบ้าง?';
  static const fatReAssessmentText = 'แล้วระดับไขมันของคุณโอเคไหม?';
  static const nextTimeFieldText = 'ไว้กรอกทีหลัง';
  //authentication
  static const registerText = 'สมัครสมาชิก';
  static const loginText = 'เข้าสู่ระบบ';
  //exchange
  static const randomBoxText = 'กล่องสุ่ม';
  static const exchangeItemText = 'แลกไอเทม';

  static const iDoTodayText = 'วันนี้ทำอะไรดี?';
  static const chooseActivityText = 'เลือกกิจกรรมที่คุณต้องการทำได้เลย!';
  static const dailyTaskEnterText = 'ภารกิจ\nประจำวัน';
  static const habitChallengeEnterText = 'ภารกิจ\nปรับนิสัย';
  static const dailyTaskText = 'ภารกิจประจำวัน';
  static const habitChallengeText = 'ภารกิจปรับนิสัย';
  static const questText = 'เควส';

  static const suggestText = 'แนะนำ';
  static const eatingText = 'การทานอาหาร';

  static const taskInProgressText = 'ทำกิจกรรมนี้';
  static const taskDoing = 'กำลังทำกิจกรรม';
  static const taskCompletedText = 'สำเร็จ';

  static const taskCompletedWithGemText = 'ทำให้ครบเพื่อรับ ';
  static const chooseText = 'เลือก ';
  static const collectRewards = 'เก็บรางวัล ';

  static const setGoalText = 'กำหนดเป้าหมายภารกิจ ';
  static const tellGoalText = 'บอกให้เรารู้ถึงเป้าหมายของคุณ ';
  static const setDayText = 'จำนวนวัน ';

  static const joinDateText = 'วันที่เข้าร่วม ';
  static const prizesToBeReceivedText = 'รางวัลที่จะได้รับ ';
  static const slideForSuccessText = 'สไลด์เมื่อเสร็จสิ้น ';

  static const joinProgram = 'เข้าร่วมโปรแกรม';
  static const missionHistoryText = 'ประวัติภารกิจ';
  static const seeAllMissionStateText = 'ทั้งหมด';
  static const activeMissionStateText = 'กำลังทำ';
  static const completedMissionStateText = 'สำเร็จแล้ว';
  static const failedMissionStateText = 'ล้มเหลว';
  static const canceledMissionStateText = 'ยกเลิก';
  static const successDailyMissionStateText =
      'เก่งมาก! คุณทำภารกิจประจำวันครบแล้ว';
  static const willReceievedText = 'จะได้รับ';

  static const minPerDayText = 'จำนวนนาทีในแต่ละวัน';
  static const missionFinishText = 'ภารกิจสำเร็จ';
  static const myItemText = 'ไอเทมของฉัน';
  static const activeText = 'ไอเทมที่กำลังใช้งาน';
  static const myAllItemText = 'ไอเทมทั้งหมด';
  static const userNotFoundText = 'ไม่พบข้อมูลผู้ใช้';
  static const noExchangeItemFound = 'ไม่พบไอเทม';

  // friends
  static const AlreadyFriendText = 'เป็นเพื่อนกับคุณแล้ว!';
  static const seeDetailsText = 'ดูข้อมูล';
  static const addText = 'เพิ่ม';
}
