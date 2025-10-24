// 在 MongoDB 中手动创建集合和索引
// 服务会自动创建，这里只需要插入初始数据

const initialServices = [{
		name: "基础洗澡-小型犬",
		description: "适合体重10kg以下的小型犬，包括洗浴、吹干、基础梳理",
		duration: 60,
		price: 80.00,
		is_active: true,
		created_at: new Date()
	},
	{
		name: "基础洗澡-中型犬",
		description: "适合体重10-25kg的中型犬，包括洗浴、吹干、基础梳理",
		duration: 90,
		price: 120.00,
		is_active: true,
		created_at: new Date()
	},
	{
		name: "基础洗澡-大型犬",
		description: "适合体重25kg以上的大型犬，包括洗浴、吹干、基础梳理",
		duration: 120,
		price: 160.00,
		is_active: true,
		created_at: new Date()
	},
	{
		name: "精致美容-小型犬",
		description: "全套美容服务：洗澡、修剪、指甲护理、耳朵清洁",
		duration: 120,
		price: 150.00,
		is_active: true,
		created_at: new Date()
	},
	{
		name: "体外驱虫",
		description: "专业的体外驱虫服务",
		duration: 30,
		price: 60.00,
		is_active: true,
		created_at: new Date()
	}
];

// 在 MongoDB Compass 或命令行中执行
// db.services.insertMany(initialServices)