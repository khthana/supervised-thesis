import { prisma } from '@/common/utils/database.util';
import type {
	Prisma,
	PrismaClient,
	course_categories,
	course_cycles,
	course_enrollments,
	course_subcategories,
	courses,
	cycle_access_emails,
	lesson_contents,
	lessons,
	users,
} from '@prisma/client';

import { validateEmail, validateUUID } from '@/common/validation/string.validation';

class CourseCycleRepository {
	private database: PrismaClient;

	constructor() {
		this.database = prisma;
	}

	async findCycleById(
		cycleId: string,
		user: users,
	): Promise<{
		success: boolean;
		data?: course_cycles | null;
		error?: string;
	}> {
		if (!validateUUID(cycleId)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid cycle ID',
			};
		}

		try {
			const cycle = await this.database.course_cycles.findUnique({
				where: {
					cycle_id: cycleId,
					AND: [
						{
							OR: [
								{ courses: { created_by: user.user_id } },
								{ cycle_access_emails: { some: { user_email: user.email } } },
								{ course_enrollments: { some: { user_id: user.user_id } } },
							],
						},
					],
				},
				include: {
					cycle_access_emails: true,
					course_enrollments: true,
					lessons: {
						include: {
							lesson_contents: true,
						},
					},
				},
			});

			if (!cycle) {
				return {
					success: false,
					data: null,
					error: '[course cycle repository] Cycle not found',
				};
			}

			return { success: true, data: cycle };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] An error occurred while retrieving course cycle',
			};
		}
	}

	async findAllCyclesByCourseId(
		user: users,
		courseId: string,
	): Promise<{
		success: boolean;
		data?: course_cycles[] | null;
		error?: string;
	}> {
		if (!user || !user.user_id) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] User not authenticated',
			};
		}

		if (!validateUUID(user.user_id)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid user ID',
			};
		}

		if (!validateEmail(user.email)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid email',
			};
		}

		if (!validateUUID(courseId)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid course ID',
			};
		}

		try {
			// สมมติว่ามีการเช็คว่า user.email เป็นขององค์กรหรือไม่
			const isOrgEmail = user.email.endsWith('@kmitl.ac.th');

			const conditions: Prisma.course_cyclesWhereInput = {
				courses: {
					course_id: courseId,
				},
				OR: [
					// เงื่อนไขสำหรับเจ้าของคอร์ส
					{
						courses: {
							created_by: user.user_id,
						},
					},
					// กรณีที่ restrict enroll เป็น true ต้องมี enroll หรือ access
					{
						is_restrict_enroll: true,
						OR: [
							{ course_enrollments: { some: { user_id: user.user_id } } },
							{ cycle_access_emails: { some: { user_email: user.email } } },
						],
					},
					// กรณีที่ restrict enroll เป็น false
					{
						is_restrict_enroll: false,
						OR: [
							// เคยลงทะเบียนแล้ว
							{ course_enrollments: { some: { user_id: user.user_id } } },
							// มี access
							{ cycle_access_emails: { some: { user_email: user.email } } },
							// สำหรับ PUBLIC: ลงทะเบียนยังเปิดอยู่
							{
								course_type: 'PUBLIC',
								OR: [{ enroll_end: null }, { enroll_end: { gt: new Date() } }],
							},
							// สำหรับ PRIVATE: เฉพาะผู้ใช้ที่มี email องค์กร และลงทะเบียนยังเปิดอยู่
							...(isOrgEmail
								? [
										{
											course_type: 'PRIVATE',
											OR: [{ enroll_end: null }, { enroll_end: { gt: new Date() } }],
										},
									]
								: []),
						],
					},
				],
			};

			const cycles = await this.database.course_cycles.findMany({
				where: conditions,
				include: {
					cycle_access_emails: true,
					course_enrollments: true, // ถ้าต้องการดูข้อมูล enroll ด้วย
				},
			});

			return {
				success: true,
				data: cycles,
			};
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] An error occurred while retrieving course cycles',
			};
		}
	}

	async createCycle(
		userEmail: string,
		courseId: string,
		cycle: Prisma.course_cyclesCreateInput,
	): Promise<{
		success: boolean;
		data?: course_cycles | null;
		error?: string;
	}> {
		if (!validateUUID(courseId)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid course ID',
			};
		}

		if (!validateEmail(userEmail)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid user email',
			};
		}

		try {
			const cycleData = await this.database.$transaction(async (prisma) => {
				const newCycle = await prisma.course_cycles.create({
					data: {
						...cycle,
						courses: {
							connect: {
								course_id: courseId,
							},
						},
					},
				});

				await prisma.cycle_access_emails.create({
					data: {
						cycle_id: newCycle.cycle_id,
						user_email: userEmail,
						access_role: 'CREATOR',
					},
				});

				return newCycle;
			});

			if (!cycleData) {
				return {
					success: false,
					data: null,
					error: '[course cycle repository] An error occurred while creating course cycle',
				};
			}

			return { success: true, data: cycleData };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] An error occurred while creating course cycle',
			};
		}
	}

	async updateCycle(
		cycleId: string,
		cycle: Prisma.course_cyclesUpdateInput,
	): Promise<{
		success: boolean;
		data?: course_cycles | null;
		error?: string;
	}> {
		if (!validateUUID(cycleId)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid cycle ID',
			};
		}

		try {
			const updatedCycle = await this.database.course_cycles.update({
				where: { cycle_id: cycleId },
				data: cycle,
			});

			if (!updatedCycle) {
				return {
					success: false,
					data: null,
					error: '[course cycle repository] An error occurred while updating course cycle',
				};
			}

			return { success: true, data: updatedCycle };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] An error occurred while updating course cycle',
			};
		}
	}

	async deleteCycle(
		cycleId: string,
		currentUserId: string,
	): Promise<{
		success: boolean;
		data?: null;
		error?: string;
	}> {
		if (!validateUUID(cycleId)) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Invalid cycle ID',
			};
		}

		const cycle = await this.database.course_cycles.findUnique({
			where: { cycle_id: cycleId },
			include: { courses: true },
		});

		if (!cycle) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] Cycle not found',
			};
		}

		if (cycle.courses.created_by !== currentUserId) {
			const admin = await this.database.admins.findUnique({
				where: { user_id: currentUserId },
			});

			if (!admin || !admin.is_active) {
				return {
					success: false,
					data: null,
					error: '[course cycle repository] Not authorized to delete course cycle',
				};
			}
		}

		try {
			await this.database.course_cycles.delete({
				where: { cycle_id: cycleId },
			});
			return { success: true, data: null };
		} catch (error) {
			return {
				success: false,
				data: null,
				error: '[course cycle repository] An error occurred while deleting course cycle',
			};
		}
	}
}

export const courseCycleRepository = new CourseCycleRepository();
