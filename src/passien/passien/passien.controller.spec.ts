import { Test, TestingModule } from "@nestjs/testing";
import { PassienController } from "./passien.controller";

describe("PassienController", () => {
	let controller: PassienController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PassienController],
		}).compile();

		controller = module.get<PassienController>(PassienController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
