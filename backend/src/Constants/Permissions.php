<?php
namespace App\Constants;

class Permissions 
{
    // Locations
    public const LOCATIONS_LIST = 'locations:list';
    public const LOCATIONS_RETRIEVE = 'locations:retrieve';
    public const LOCATIONS_CREATE = 'locations:create';
    public const LOCATIONS_EDIT = 'locations:edit';
    public const LOCATIONS_ACTIVATE = 'locations:activate';
    public const LOCATIONS_DEACTIVATE = 'locations:deactivate';
    
    // Users
    public const USERS_LIST = 'users:list';
    public const USERS_RETRIEVE = 'users:retrieve';
    public const USERS_CREATE = 'users:create';
    public const USERS_EDIT = 'users:edit';
    public const USERS_ACTIVATE = 'users:activate';
    public const USERS_DEACTIVATE = 'users:deactivate';
    public const USERS_CHANGE_PASSWORD_ANY = 'users:change_password:any';
    public const USERS_CHANGE_PASSWORD_OWN = 'users:change_password:own';
    public const USERS_PROFILE = 'users:profile';

    // Audit logs
    public const AUDIT_VIEW = 'audit:view';

    // Categories
    public const CATEGORIES_LIST = 'categories:list';
    public const CATEGORIES_CREATE = 'categories:create';
    public const CATEGORIES_EDIT = 'categories:edit';
    public const CATEGORIES_ACTIVATE = 'categories:activate';
    public const CATEGORIES_DEACTIVATE = 'categories:deactivate';

    // Units
    public const UNITS_LIST = 'units:list';
    public const UNITS_CREATE = 'units:create';
    public const UNITS_EDIT = 'units:edit';
    public const UNITS_ACTIVATE = 'units:activate';
    public const UNITS_DEACTIVATE = 'units:deactivate';

    // Products
    public const PRODUCTS_LIST = 'products:list';
    public const PRODUCTS_RETRIEVE = 'products:retrieve';
    public const PRODUCTS_CREATE = 'products:create';
    public const PRODUCTS_EDIT = 'products:edit';
    public const PRODUCTS_ACTIVATE = 'products:activate';
    public const PRODUCTS_DEACTIVATE = 'products:deactivate';

    // Suppliers
    public const SUPPLIERS_LIST = 'suppliers:list';
    public const SUPPLIERS_CREATE = 'suppliers:create';
    public const SUPPLIERS_EDIT = 'suppliers:edit';
    public const SUPPLIERS_ACTIVATE = 'suppliers:activate';
    public const SUPPLIERS_DEACTIVATE = 'suppliers:deactivate';

    // Receipts (Receiving)
    public const RECEIPTS_LIST = 'receipts:list';
    public const RECEIPTS_RETRIEVE = 'receipts:retrieve';
    public const RECEIPTS_CREATE = 'receipts:create';

    // Stock adjustments
    public const ADJUSTMENTS_LIST = 'adjustments:list';
    public const ADJUSTMENTS_CREATE = 'adjustments:create';
    public const ADJUSTMENTS_REJECT = 'adjustments:reject';
    public const ADJUSTMENTS_APPROVE = 'adjustments:approve';

    // Stock balances (inventory)
    public const INVENTORY_VIEW = 'inventory:view';


    // Mapping to specific roles & Admin
    public const FOR_EXECUTIVE = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,

        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_PROFILE,
        self::USERS_LIST,

        self::AUDIT_VIEW,
        
        self::CATEGORIES_LIST,

        self::UNITS_LIST,

        self::PRODUCTS_LIST,

        self::RECEIPTS_LIST,

        self::INVENTORY_VIEW,

        self::ADJUSTMENTS_LIST,
    ];

    public const FOR_CENTRAL = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,

        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_PROFILE,

        self::UNITS_LIST,

        self::CATEGORIES_LIST,

        self::PRODUCTS_LIST,

        self::RECEIPTS_LIST,
        self::RECEIPTS_CREATE,

        self::INVENTORY_VIEW,

        self::SUPPLIERS_LIST,
        self::SUPPLIERS_CREATE,

        self::ADJUSTMENTS_LIST,
        self::ADJUSTMENTS_CREATE,
    ];

    public const FOR_OUTLET = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,

        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_PROFILE,
        
        self::UNITS_LIST,

        self::CATEGORIES_LIST,

        self::PRODUCTS_LIST,

        self::RECEIPTS_LIST,
        self::RECEIPTS_CREATE,

        self::INVENTORY_VIEW,

        self::SUPPLIERS_LIST,
        self::SUPPLIERS_CREATE,

        self::ADJUSTMENTS_LIST,
        self::ADJUSTMENTS_CREATE,
    ];

    public const FOR_VIEWER = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,

        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_PROFILE,
        self::UNITS_LIST,

        self::CATEGORIES_LIST,

        self::PRODUCTS_LIST,

        self::RECEIPTS_LIST,

        self::INVENTORY_VIEW,

        self::ADJUSTMENTS_LIST,
    ];
    

    public const ALL = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,
        self::LOCATIONS_CREATE,
        self::LOCATIONS_EDIT,
        self::LOCATIONS_ACTIVATE,
        self::LOCATIONS_DEACTIVATE,

        self::USERS_LIST,
        self::USERS_RETRIEVE,
        self::USERS_CREATE,
        self::USERS_EDIT,
        self::USERS_CHANGE_PASSWORD_ANY,
        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_ACTIVATE,
        self::USERS_DEACTIVATE,
        self::USERS_PROFILE,

        self::AUDIT_VIEW,

        self::CATEGORIES_LIST,
        self::CATEGORIES_CREATE,
        self::CATEGORIES_EDIT,
        self::CATEGORIES_ACTIVATE,
        self::CATEGORIES_DEACTIVATE,

        self::UNITS_LIST,
        self::UNITS_CREATE,
        self::UNITS_EDIT,
        self::UNITS_ACTIVATE,
        self::UNITS_DEACTIVATE,

        self::PRODUCTS_LIST,
        self::PRODUCTS_RETRIEVE,
        self::PRODUCTS_CREATE,
        self::PRODUCTS_EDIT,
        self::PRODUCTS_ACTIVATE,
        self::PRODUCTS_DEACTIVATE,

        self::SUPPLIERS_LIST,
        self::SUPPLIERS_CREATE,
        self::SUPPLIERS_EDIT,
        self::SUPPLIERS_ACTIVATE,
        self::SUPPLIERS_DEACTIVATE,

        self::RECEIPTS_LIST,
        self::RECEIPTS_RETRIEVE,
        self::RECEIPTS_CREATE,

        self::INVENTORY_VIEW,

        self::ADJUSTMENTS_LIST,
        self::ADJUSTMENTS_CREATE,
        self::ADJUSTMENTS_REJECT,
        self::ADJUSTMENTS_APPROVE,
    ];
}