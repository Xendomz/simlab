import { AcademicYearService } from "@/application/academic-year/AcademicYearService"
import { BookingService } from "@/application/booking/BookingService"
import { FacultyService } from "@/application/faculty/FacultyService"
import { LaboratoryEquipmentService } from "@/application/laboratory-equipment/LaboratoryEquipmentService"
import { LaboratoryMaterialService } from "@/application/laboratory-material/LaboratoryMaterialService"
import { LaboratoryRoomService } from "@/application/laboratory-room/LaboratoryRoomService"
import { MajorService } from "@/application/major/MajorService"
import { PracticumModuleService } from "@/application/practicum-module/PracticumModuleService"
import { PracticumSchedulingService } from "@/application/practicum-scheduling/PracticumSchedulingService"
import { PracticumService } from "@/application/practicum/PracticumService"
import { StudyProgramService } from "@/application/study-program/StudyProgramService"
import { TestingTypeService } from "@/application/testing-type/TestingTypeService"
import { UserService } from "@/application/user/UserService"
import { createContext } from "react"

type Services = {
    userService: UserService,
    laboratoryRoomService: LaboratoryRoomService,
    laboratoryEquipmentService: LaboratoryEquipmentService,
    laboratoryMaterialService: LaboratoryMaterialService,
    testingTypeService: TestingTypeService,
    practicumService: PracticumService,
    practicumModuleService: PracticumModuleService,
    majorService: MajorService,
    facultyService: FacultyService,
    academicYearService: AcademicYearService
    studyProgramService: StudyProgramService
    practicumSchedulingService: PracticumSchedulingService,
    bookingService: BookingService
}

const services: Services = {
    userService: new UserService(),
    laboratoryRoomService: new LaboratoryRoomService(),
    laboratoryEquipmentService: new LaboratoryEquipmentService(),
    laboratoryMaterialService: new LaboratoryMaterialService(),
    testingTypeService: new TestingTypeService(),
    practicumService: new PracticumService(),
    practicumModuleService: new PracticumModuleService(),
    majorService: new MajorService(),
    facultyService: new FacultyService(),
    academicYearService: new AcademicYearService(),
    studyProgramService: new StudyProgramService(),
    practicumSchedulingService: new PracticumSchedulingService(),
    bookingService: new BookingService()
}

export const DepedencyContext = createContext<Services>(services)

export const DepedencyProvider = ({ children }: { children: React.ReactNode }) => (
    <DepedencyContext.Provider value={services}>{ children }</DepedencyContext.Provider>
)