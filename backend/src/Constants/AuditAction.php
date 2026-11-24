<?php
namespace App\Constants;

final class AuditAction
{
    // locations
    public const LOCATION_CREATED = 'location.created';
    public const LOCATION_UPDATED = 'location.updated';
    public const LOCATION_DEACTIVATED = 'location.deactivated';
    public const LOCATION_ACTIVATED = 'location.activated';
    
    // users
    public const USER_CREATED = 'user.created';
    public const USER_UPDATED = 'user.updated';
    public const USER_PASSWORD_CHANGED = 'user.password_changed';
    public const USER_PASSWORD_CHANGE_FAILED = 'user.password_change_failed';
    public const USER_PASSWORD_RESET = 'user.password_reset';
    public const USER_DEACTIVATED = 'user.deactivated';
    public const USER_ACTIVATED = 'user.activated';

    // auth
    public const LOGIN_FAILED = 'auth.login_failed';
    public const REFRESH_FAILED = 'auth.refresh_failed';
    public const REFRESH_TOKEN_REUSE = 'auth.refresh_token_reuse';
    public const LOGIN = 'auth.login';
    public const LOGIN_DENIED_INACTIVE = 'auth.login_denied_inactive_account';
    public const LOGOUT = 'auth.logout';

    // categories
    public const CATEGORY_CREATED = 'category.created';
    public const CATEGORY_UPDATED = 'category.updated';
    public const CATEGORY_ACTIVATED = 'category.activated';
    public const CATEGORY_DEACTIVATED = 'category.deactivated';

    // Units
    public const UNIT_CREATED = 'unit.created';
    public const UNIT_UPDATED = 'unit.updated';
    public const UNIT_ACTIVATED = 'unit.activated';
    public const UNIT_DEACTIVATED = 'unit.deactivated';

    // Products
    public const PRODUCT_CREATED = 'product.created';
    public const PRODUCT_UPDATED = 'product.updated';
    public const PRODUCT_ACTIVATED = 'product.activated';
    public const PRODUCT_DEACTIVATED = 'product.deactivated';

    // Product - Unit
    public const PRODUCT_UNIT_CHANGED = 'product_unit.changed';

    // Suppliers
    public const SUPPLIER_CREATED = 'supplier.created';
    public const SUPPLIER_UPDATED = 'supplier.updated';
    public const SUPPLIER_ACTIVATED = 'supplier.activated';
    public const SUPPLIER_DEACTIVATED = 'supplier.deactivated';
    
    // Receipts (Receiving)
    public const RECEIPT_CREATED = 'receipt.created';

    // Prices
    public const PRICE_CREATED = 'price.created';
    public const PRICE_CHANGED = 'price.changed';

    // Stock adjustments
    public const ADJUSTMENT_CREATED = 'adjustment.created';
    public const ADJUSTMENT_APPROVED = 'adjustment.approved';
    public const ADJUSTMENT_SELF_APPROVED = 'adjustment.self_approved';
    public const ADJUSTMENT_REJECTED = 'adjustment.rejected';
    public const ADJUSTMENT_CANCELLED = 'adjustment.cancelled';
}