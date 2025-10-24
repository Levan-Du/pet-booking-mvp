import { validateRequest } from '../core/middleware/validation.middleware.js';
import { authenticateUserToken } from '../core/middleware/auth.middleware.js';
import {
  PET_TYPES,
  PET_TYPES_TEXT,
  PET_TYPES_ICON,
  PET_SIZES,
  PET_SIZES_TEXT,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_TEXT
} from '../shared/enums/index.js';

export class BaseController {
  constructor(validation = null, resourcePath = '') {
    this.validation = validation;
    this.validateRequest = validateRequest;
    this.authenticateUserToken = authenticateUserToken;
    this.basePath = `/api/${resourcePath}`; // 默认基础路径，子类可覆盖
  }

  // 构建基础路由映射表
  buildBaseRouteMap() {
    return {
      'GET:/:id': {
        handler: this.getById?.bind(this),
        middlewares: [this.authenticateUserToken]
      },
      'GET:/doc/:doc_no': {
        handler: this.getByNo?.bind(this),
        middlewares: [this.authenticateUserToken]
      },
      'POST:/login': {
        handler: this.create?.bind(this),
        middlewares: [
          this.validation?.create ? this.validateRequest(this.validation.create) : null,
          this.authenticateUserToken
        ].filter(Boolean) // 过滤掉null值
      },
      'PUT:/:id': {
        handler: this.update?.bind(this),
        middlewares: [
          this.validation?.update ? this.validateRequest(this.validation.update) : null,
          this.authenticateUserToken
        ].filter(Boolean)
      },
      'DELETE:/:id': {
        handler: this.delete?.bind(this),
        middlewares: [this.authenticateUserToken]
      },
      'GET:/enums': {
        handler: this.getAllEnums?.bind(this),
        middlewares: []
      },
      'GET:/enums/pet-types': {
        handler: this.getPetTypes?.bind(this),
        middlewares: []
      },
      'GET:/enums/pet-sizes': {
        handler: this.getPetSize?.bind(this),
        middlewares: []
      },
      'GET:/enums/appointment-status': {
        handler: this.getAppointmentStatus?.bind(this),
        middlewares: []
      },
    };
  }

  // 构建完整路由映射表（子类可覆盖）
  buildRouteMap(extraRouteMap = {}) {
    const baseMap = this.buildBaseRouteMap();

    // 合并路由映射，子类路由优先
    return {
      ...baseMap,
      ...extraRouteMap
    };
  }

  // 主路由方法
  async route(req, res, next) {
    const { method, path } = req;

    try {
      // 解析路径参数（支持动态资源路径）
      const pathWithoutBase = path.replace(this.basePath, '') || '/';

      // 构建路由键
      let routeKey = `${method}:${pathWithoutBase}`;

      // 获取路由映射表
      const routeMap = this.buildRouteMap()

      // 尝试匹配动态路由 (如 /:id)
      if (!routeMap[routeKey] && pathWithoutBase.includes('/')) {
        const pathSegments = pathWithoutBase.split('/').filter(Boolean);
        if (pathSegments.length === 2 && !isNaN(pathSegments[1])) {
          // 匹配 /resource/:id 模式
          routeKey = `${method}:/${pathSegments[0]}/:id`;
        }
      }
      const routeConfig = routeMap[routeKey];
      // routeConfig.middlewares = routeConfig.middlewares.map(mw => mw.handler.bind(this))

      if (!routeConfig) {
        return res.status(404).json({
          success: false,
          error: '接口不存在',
          availableRoutes: Object.keys(routeMap).map(key => key.replace(':', ' '))
        });
      }

      // ✅ 正确：绑定 this 上下文
      const boundHandler = routeConfig.handler.bind(this);
      const boundMiddlewares = routeConfig.middlewares.map(middleware =>
        middleware.bind(this)
      );

      // 执行中间件和处理器
      await this.executeMiddlewares(boundMiddlewares, req, res, () => {
        boundHandler(req, res);
      });

      // 执行中间件链
      // await this.executeMiddlewares(routeConfig.middlewares, req, res, next);

      // 如果中间件已经发送了响应，则停止执行
      if (res.headersSent) return;

      // 执行主处理函数
      await boundHandler(req, res, next);

    } catch (error) {
      console.error('Route handling error:', error);
      next(error);
    }
  }

  // 执行中间件链（优化版）
  async executeMiddlewares(middlewares, req, res, next) {
    for (const middleware of middlewares) {
      if (!middleware) continue; // 跳过空的中间件

      try {
        await new Promise((resolve, reject) => {
          const next = (err) => {
            if (err) reject(err);
            else resolve();
          };

          // 执行中间件
          const result = middleware(req, res, next);

          // 处理 Promise 返回的中间件
          if (result instanceof Promise) {
            result.then(() => resolve()).catch(reject);
          }
        });

        // 如果中间件已经发送了响应，停止执行后续中间件
        if (res.headersSent) break;

      } catch (error) {
        // 中间件执行出错
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: '中间件执行失败',
            message: error.message
          });
        }
        break;
      }
    }
  }

  // 默认的 CRUD 方法（子类应该覆盖这些方法）
  async getAll(req, res, next) {
    res.status(501).json({ error: 'getAll 方法未实现' });
  }

  async getById(req, res, next) {
    res.status(501).json({ error: 'getById 方法未实现' });
  }

  async getByNo(req, res, next) {
    res.status(501).json({ error: 'getByNo 方法未实现' });
  }

  async create(req, res, next) {
    res.status(501).json({ error: 'create 方法未实现' });
  }

  async update(req, res, next) {
    res.status(501).json({ error: 'update 方法未实现' });
  }

  async delete(req, res, next) {
    res.status(501).json({ error: 'delete 方法未实现' });
  }


  convertFilter(req) {
    const { query, params, user } = { query: req.query, params: req.params, user: req.headers['pet-user'] }
    // console.log('base.controller.js -> convertFilter -> query,params', query, params)
    const filterItems = { phone: 'customer_phone', id: '_id' }
    const filters = { customer_phone: user.phone }
    Object.keys(query).forEach(q => filters[filterItems[q]] = query[q])
    Object.keys(params).forEach(q => filters[filterItems[q]] = q === 'id' ? new ObjectId(params[q]) : params[q])
    console.log('appointment.controller.js -> convertFilter -> filters', filters)
    return filters
  }

  getAllEnums(req, res, next) {
    console.log('base.controller.js -> getAllEnums -> 1111111111111111')
    try {
      const enumData = {
        petTypes: Object.values(PET_TYPES).map(type => ({
          value: type,
          label: PET_TYPES_TEXT[type],
          icon: PET_TYPES_ICON[type]
        })),
        petSizes: Object.values(PET_SIZES).map(size => ({
          value: size,
          label: PET_SIZES_TEXT[size]
        })),
        appointmentStatus: Object.values(APPOINTMENT_STATUS).map(status => ({
          value: status,
          label: APPOINTMENT_STATUS_TEXT[status]
        }))
      };

      res.json({
        success: true,
        data: enumData
      });
    } catch (error) {
      console.error('获取枚举数据失败:', error);
      res.status(500).json({
        success: false,
        message: '获取枚举数据失败'
      });
    }
  }

  getPetTypes(req, res, next) {
    try {
      const petTypes = Object.values(PET_TYPES).map(type => ({
        value: type,
        label: PET_TYPES_TEXT[type],
        icon: PET_TYPES_ICON[type]
      }));

      res.json({
        success: true,
        data: petTypes
      });
    } catch (error) {
      console.error('获取宠物类型枚举失败:', error);
      res.status(500).json({
        success: false,
        message: '获取宠物类型枚举失败'
      });
    }
  }

  getPetSize(req, res, next) {
    try {
      const petSizes = Object.values(PET_SIZES).map(size => ({
        value: size,
        label: PET_SIZES_TEXT[size]
      }));

      res.json({
        success: true,
        data: petSizes
      });
    } catch (error) {
      console.error('获取宠物体型枚举失败:', error);
      res.status(500).json({
        success: false,
        message: '获取宠物体型枚举失败'
      });
    }
  }

  getAppointmentStatus(req, res, next) {
    try {
      const appointmentStatus = Object.values(APPOINTMENT_STATUS).map(status => ({
        value: status,
        label: APPOINTMENT_STATUS_TEXT[status]
      }));

      res.json({
        success: true,
        data: appointmentStatus
      });
    } catch (error) {
      // console.error('获取预约状态枚举失败:', error);
      res.status(500).json({
        success: false,
        message: '获取预约状态枚举失败'
      });
    }
  }
}