// 代码生成时间: 2025-08-30 18:22:42
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

// 定义用户权限模型
interface UserPermission {
  username: string;
  permissions: string[];
}

// 用户权限数据（示例）
const userPermissions: UserPermission[] = [
  {
    username: 'admin',
    permissions: ['read', 'write', 'delete'],
  },
  {
    username: 'user',
    permissions: ['read'],
  },
];

// 创建Express应用
const app = express();
const router: Router = express.Router();

// 检查用户是否有权限
function hasPermission(username: string, permission: string): boolean {
  const user = userPermissions.find((u) => u.username === username);
  return user ? user.permissions.includes(permission) : false;
}

// 获取用户权限
router.get('/users/:username/permissions', (req: Request, res: Response) => {
  const { username } = req.params;
  const user = userPermissions.find((u) => u.username === username);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  res.json(user.permissions);
});

// 检查用户权限中间件
function checkPermission(permission: string) {
  return (req: Request, res: Response, next: Function) => {
    const { username } = req.params;
    if (!hasPermission(username, permission)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Forbidden: User does not have permission',
      });
    }
    next();
  };
}

// 添加用户权限
router.post('/users/:username/permissions', checkPermission('write'), (req: Request, res: Response) => {
  const { username } = req.params;
  const { permissions } = req.body;
  const user = userPermissions.find((u) => u.username === username);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  user.permissions = permissions;
  res.status(StatusCodes.CREATED).json(user.permissions);
});

// 删除用户权限
router.delete('/users/:username/permissions', checkPermission('delete'), (req: Request, res: Response) => {
  const { username } = req.params;
  const user = userPermissions.find((u) => u.username === username);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  user.permissions = [];
  res.status(StatusCodes.OK).json({
    message: 'Permissions removed',
  });
});

// 将路由添加到应用
app.use('/api', router);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});