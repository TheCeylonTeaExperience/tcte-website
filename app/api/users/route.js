import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token);
      console.log(decoded);
      if (decoded.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    let users = await prisma.user.findMany({
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    users = users.map((user) => {
      return {
        ...user,
        userPermissions: user.userPermissions.flatMap((up) => {
          return {
            route: up.permission.route,
            sectionName: up.permission.sectionName,
            accessType: up.accessType,
            permitted: true,
          }
        }),
      };
    });

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error("Create user error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token);
      // Only admins can create new admins/users
      if (decoded.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Parse Payload
    const body = await request.json();
    const { designation, name, email, password, permissions } = body;

    if (!designation || !email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }

    // 4. Create User
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.$transaction(async (tx) => {
      const permissionConnections = [];

      // Make sure permissions array exists before running the loop
      const activePermissions = Array.isArray(permissions) ? permissions : [];

      for (const perm of activePermissions) {
        const dbPermission = await tx.permission.upsert({
          where: { route: perm.route },
          update: { sectionName: perm.sectionName },
          create: {
            route: perm.route,
            sectionName: perm.sectionName,
          }
        });

        // This structure maps directly to the UserPermission junction model fields
        permissionConnections.push({
          accessType: perm.accessType,
          permissionId: dbPermission.id // Direct connection on the explicit join model
        });
      }

      return await tx.user.create({
        data: {
          designation,
          name,
          email: normalizedEmail,
          password: hashedPassword,
          userPermissions: {             // FIXED: Changed from permissions to userPermissions
            create: permissionConnections,
          }
        },
        select: {
          id: true,
          designation: true,
          name: true,
          email: true,
          createdAt: true,
          userPermissions: {             // FIXED: Changed from permissions to userPermissions
            select: {
              accessType: true,
              permission: {
                select: {
                  route: true,
                  sectionName: true,
                }
              }
            }
          }
        }
      });
    });

    const formattedUser = {
      ...newUser,
      userPermissions: newUser.userPermissions.map((up) => ({
        route: up.permission.route,
        sectionName: up.permission.sectionName,
        accessType: up.accessType,
        permitted: true,
      }))
    };

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully",
      data: formattedUser,
    });
  } catch (error) {
    console.error("Create user error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 },
      );
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token);

      if (decoded.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, designation, name, email, password, permissions } = body;

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updateData = {};
    if (designation) updateData.designation = designation;
    if (name) updateData.name = name;
    if (email) updateData.email = email.trim().toLowerCase();
    if (password) updateData.password = await hashPassword(password);

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (Array.isArray(permissions)) {
        await tx.userPermission.deleteMany({
          where: { userId: userId },
        });

        for (const perm of permissions) {
          const dbPermission = await tx.permission.upsert({
            where: { route: perm.route },
            update: { sectionName: perm.sectionName },
            create: {
              route: perm.route,
              sectionName: perm.sectionName
            }
          });

          await tx.userPermission.create({
            data: {
              userId: userId,
              permissionId: dbPermission.id,
              accessType: perm.accessType
            }
          });
        }
      }

      return await tx.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          designation: true,
          name: true,
          email: true,
          updatedAt: true,
          userPermissions: {
            select: {
              accessType: true,
              permission: {
                select: {
                  route: true,
                  sectionName: true,
                }
              }
            }
          }
        }
      });
    });

    const formattedUser = {
      ...updatedUser,
      userPermissions: updatedUser.userPermissions.map((up) => ({
        route: up.permission.route,
        sectionName: up.permission.sectionName,
        accessType: up.accessType,
        permitted: true,
      }))
    };

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully",
      data: formattedUser,
    });
  } catch (err) {
    console.error("user update error: ", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token);
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }); // Cleaned error msg
    }

    //  FIXED: Extract from URL Search Parameters instead of JSON body
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Verify user exists before deleting to handle Prisma 404 targets cleanly
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        designation: true,
        name: true,
        email: true,
        updatedAt: true,
        userPermissions: {
          select: {
            accessType: true,
            permission: {
              select: {
                route: true,
                sectionName: true,
              }
            }
          }
        }
      }
    });

    const formattedUser = {
      ...deletedUser,
      userPermissions: deletedUser.userPermissions.map((up) => ({
        route: up.permission.route,
        sectionName: up.permission.sectionName,
        accessType: up.accessType,
        permitted: true,
      }))
    };

    return NextResponse.json({
      success: true,
      message: "User profile deleted successfully",
      data: formattedUser
    });
  } catch (err) {
    console.error("user delete error: ", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}