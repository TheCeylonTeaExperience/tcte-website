import { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const PermissionHierarchy = forwardRef((props, ref) => {
    const [permissions, setPermissions] = useState([
        {
            route: "/dashboard",
            sectionName: "Dashboard",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/profile",
            sectionName: "Profile",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/location",
            sectionName: "Location",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/program-settings",
            sectionName: "Program Settings",
            children: [
                {
                    route: "/sessions",
                    sectionName: "Sessions",
                    accessType: "READ_ONLY",
                    permitted: false
                },
                {
                    route: "/programs",
                    sectionName: "Programs",
                    accessType: "READ_ONLY",
                    permitted: false
                },
                {
                    route: "/program-types",
                    sectionName: "Program Types",
                    accessType: "READ_ONLY",
                    permitted: false
                },
                {
                    route: "/discount-rules",
                    sectionName: "Discount Rules",
                    accessType: "READ_ONLY",
                    permitted: false
                },
            ]
        },
        {
            route: "/bookings",
            sectionName: "Bookings",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/customers",
            sectionName: "Customers",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/agents",
            sectionName: "Agents",
            accessType: "READ_ONLY",
            permitted: false
        },
        {
            route: "/commission",
            sectionName: "Commission",
            children: [
                {
                    route: "/commission-rules",
                    sectionName: "Commission Rules",
                    accessType: "READ_ONLY",
                    permitted: false
                },
                {
                    route: "/affiliate-earnings",
                    sectionName: "Affiliate Earnings",
                    accessType: "READ_ONLY",
                    permitted: false
                },
            ]
        },
    ]);

    useImperativeHandle(ref, () => ({
        getPermissions: () => {
            return permissions.flatMap((p) => {
                const result = [];

                if (!isParent(p) && p.permitted) {
                    result.push(p);
                }

                if (isParent(p) && p.children) {
                    const permittedChildren = p.children.filter(cp => cp.permitted);
                    result.push(...permittedChildren);
                }

                return result;
            });
        }
    }), [permissions]);

    const togglePermission = useCallback((permission) => {
        if (isParent(permission)) {
            setPermissions(prev => prev.map((p) => {
                if (p.route === permission.route) {
                    return {
                        ...p,
                        permitted: !p.permitted,
                        children: p.children.map((cp) => {
                            return {
                                ...cp,
                                permitted: !p.permitted
                            };
                        })
                    }
                } else {
                    return p;
                }
            }));

            return;
        }

        setPermissions(prev => prev.map((p) => {
            if (isParent(p)) {
                return {
                    ...p,
                    children: p.children.map((cp) => {
                        if (cp.route === permission.route) {
                            return { ...cp, permitted: !cp.permitted };
                        }

                        return cp;
                    }),
                };
            }

            if (p.route === permission.route) {
                return { ...p, permitted: !p.permitted };
            }

            return p;
        }));
    }, [permissions]);

    const handlePermissionTypeChange = useCallback((permission, value) => {
        setPermissions(prev => prev.map((p) => {
            if (isParent(p)) {
                return {
                    ...p,
                    children: p.children.map((cp) => {
                        if (cp.route === permission.route) {
                            return {
                                ...cp,
                                accessType: value
                            }
                        }

                        return cp;
                    })
                };
            }

            if (p.route === permission.route) {
                return {
                    ...p,
                    accessType: value
                };
            }

            return p;
        }));
    }, []);

    const isParent = useCallback((permission) => {
        return Object.keys(permission).includes("children");
    }, []);

    return (
        <div className="flex flex-col space-y-2">
            <Label>Permissions</Label>
            <fieldset id="permissions_hierarchy" className="space-y-2">
                {permissions.map((permission, idx) => {
                    if (isParent(permission)) {
                        return (
                            <div key={idx}>
                                <div className="flex items-center">
                                    <Input type="checkbox" id={`"${idx}"`} className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={permission.children.filter((p) => p.permitted).length > 0 ? true : false} onChange={() => togglePermission(permission)} />
                                    <label htmlFor={`"${idx}"`} className="ml-2 block text-sm font-medium text-gray-900">{permission.sectionName}</label>
                                </div>

                                <div className="ml-6 mt-2 space-y-2 border-l border-gray-200 pl-4">
                                    {permission.children.map((childPermission, idx) => (
                                        <div key={`"${idx}"`} className="flex flex-col space-y-1">
                                            <div className="flex items-center">
                                                <Input type="checkbox" id="child-1" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={childPermission.permitted} onChange={() => togglePermission(childPermission)} />
                                                <label htmlFor="child-1" className="ml-2 block text-sm text-gray-500">{childPermission.sectionName}</label>
                                            </div>
                                            {childPermission.permitted && <div className="flex flex-row">
                                                <Select
                                                    value={childPermission.accessType}
                                                    onValueChange={(value) => handlePermissionTypeChange(childPermission, value)}>
                                                    <SelectTrigger id="permissionType">
                                                        <SelectValue placeholder="Select a permission type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={"READ_ONLY"}>Read only</SelectItem>
                                                        <SelectItem value={"READ_WRITE"}>Read/Write</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={`"${idx}"`} className="flex flex-col">
                                <div className="flex items-center">
                                    <Input type="checkbox" id="parent" className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={permission.permitted} onChange={() => togglePermission(permission)} />
                                    <label htmlFor="parent" className="ml-2 block text-sm font-medium text-gray-900">{permission.sectionName}</label>
                                </div>
                                {permission.permitted && (<Select
                                    value={permission.accessType} onValueChange={(value) => handlePermissionTypeChange(permission, value)}>
                                    <SelectTrigger id="permissionType">
                                        <SelectValue placeholder="Select a permission type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"READ_ONLY"}>Read only</SelectItem>
                                        <SelectItem value={"READ_WRITE"}>Read/Write</SelectItem>
                                    </SelectContent>
                                </Select>)}
                            </div>
                        );
                    }
                })}
            </fieldset >
        </div>
    );
});

export default memo(PermissionHierarchy);