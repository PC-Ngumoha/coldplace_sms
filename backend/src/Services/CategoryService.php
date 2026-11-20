<?php

namespace App\Services;

use App\Constants\AuditAction;
use App\Repositories\CategoryRepository;
use App\Constants\Category;
use App\Exceptions\AppException;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\TransactionManager;

class CategoryService
{
    public function __construct(private CategoryRepository $repo,
                                private AuditLogger $audit,
                                private TransactionManager $tx)
    {}

    public function list(): array
    {
        return $this->repo->listAllCategories();
    }

    public function create(Actor $actor, array $data): int
    {
        $name = trim((string) ($data['name'] ?? ''));

        if ($name === '') {
            throw new AppException('Missing parameters', 400);
        }

        try {
            return $this->tx->run(function () use ($actor, $name) {
                $id = $this->repo->createCategory([
                    'name' => $name,
                    'created_by' => $actor->userId
                ]);

                $this->audit->log(
                    $actor,
                    AuditAction::CATEGORY_CREATED,
                    'categories',
                    $id,
                    null,
                    ['name' => $name ]
                );

                return $id;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {  // Duplicate rows found
                throw new AppException('A category with this name already exists', 409);
            }
            throw $err;
        }

    }

    public function update(Actor $actor, int $categoryId, array $data): int {

        $name = trim((string) ($data['name'] ?? ''));

        if ($name === '') {
            throw new AppException('Missing parameters', 400);
        }

        try {
            return $this->tx->run(function () use ($actor, $categoryId, $name ) {
                $old = $this->repo->retrieveCategoryForUpdate($categoryId);

                if (!$old) {
                    throw new AppException('Not found', 404);
                }


                if ($old['name'] === $name) return 0;

                $rows = $this->repo->updateCategory($categoryId, [
                    'name' => $name,
                ]);

                $this->audit->log(
                    $actor,
                    AuditAction::CATEGORY_UPDATED,
                    'categories',
                    $categoryId,
                    [ 'name' => $old['name'] ],
                    [ 'name' => $name ]
                );

                return $rows;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {
                throw new AppException('A category with this name already exists', 409);
            }
            throw $err;
        }
    }

    public function deactivate(Actor $actor, int $categoryId): int
    {
        return $this->tx->run(function () use ($actor, $categoryId) {
            $category = $this->repo->retrieveCategoryForUpdate($categoryId);

            if (!$category) {
                throw new AppException('Not found', 404);
            }

            if ($category['status'] !== Category::ACTIVE) {
                return 0;
            }

            $rows = $this->repo->setStatus($categoryId, Category::INACTIVE);

            if ($rows === 1) {
                $this->audit->log(
                    $actor,
                    AuditAction::CATEGORY_DEACTIVATED,
                    'categories',
                    $categoryId,
                    ['status' => Category::ACTIVE],
                    ['status' => Category::INACTIVE],
                );
            }

            return $rows;
        });
    }

    public function activate(Actor $actor, int $categoryId): int
    {
        return $this->tx->run(function () use ($actor, $categoryId) {
            $category = $this->repo->retrieveCategoryForUpdate($categoryId);

            if (!$category) {
                throw new AppException('Not found', 404);
            }

            if ($category['status'] !== Category::INACTIVE) {
                return 0;
            }

            $rows = $this->repo->setStatus($categoryId, Category::ACTIVE);

            if ($rows === 1) {
                $this->audit->log(
                    $actor,
                    AuditAction::CATEGORY_ACTIVATED,
                    'categories',
                    $categoryId,
                    ['status' => Category::INACTIVE],
                    ['status' => Category::ACTIVE],
                );
            }

            return $rows;
        });
    }
}