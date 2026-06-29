<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            // Add a plain category index first so MySQL can release the old
            // composite unique index without violating the foreign key on category_id.
            if (! Schema::hasIndex('votes', 'votes_category_voted_at_index')) {
                $table->index(['category_id', 'voted_at'], 'votes_category_voted_at_index');
            }
        });

        Schema::table('votes', function (Blueprint $table) {
            if (! Schema::hasColumn('votes', 'page_time_seconds')) {
                $table->unsignedInteger('page_time_seconds')->nullable()->after('language');
            }

            if (! Schema::hasColumn('votes', 'mouse_move_count')) {
                $table->unsignedInteger('mouse_move_count')->default(0)->after('page_time_seconds');
            }

            if (! Schema::hasColumn('votes', 'scroll_count')) {
                $table->unsignedInteger('scroll_count')->default(0)->after('mouse_move_count');
            }

            if (! Schema::hasColumn('votes', 'focus_count')) {
                $table->unsignedInteger('focus_count')->default(0)->after('scroll_count');
            }

            if (! Schema::hasColumn('votes', 'blur_count')) {
                $table->unsignedInteger('blur_count')->default(0)->after('focus_count');
            }

            if (Schema::hasIndex('votes', 'votes_category_ip_voted_at_index')) {
                $table->dropIndex('votes_category_ip_voted_at_index');
            }

            if (Schema::hasIndex('votes', 'votes_category_id_fingerprint_js_unique')) {
                $table->dropUnique('votes_category_id_fingerprint_js_unique');
            }

            if (Schema::hasIndex('votes', 'votes_category_hash_voted_at_index')) {
                $table->dropIndex('votes_category_hash_voted_at_index');
            }

            if (Schema::hasIndex('votes', 'vote_category_hash_unique')) {
                $table->dropUnique('vote_category_hash_unique');
            }

            if (! Schema::hasIndex('votes', 'votes_category_hash_voted_at_index')) {
                $table->index(['category_id', 'multi_factor_hash', 'voted_at'], 'votes_category_hash_voted_at_index');
            }

            if (! Schema::hasIndex('votes', 'votes_category_voted_at_index')) {
                $table->index(['category_id', 'voted_at'], 'votes_category_voted_at_index');
            }

            if (! Schema::hasIndex('votes', 'votes_category_fingerprint_unique')) {
                $table->unique(['category_id', 'fingerprint_js'], 'votes_category_fingerprint_unique');
            }

            if (! Schema::hasIndex('votes', 'votes_category_multi_factor_unique')) {
                $table->unique(['category_id', 'multi_factor_hash'], 'votes_category_multi_factor_unique');
            }
        });

        Schema::table('vote_attempt_logs', function (Blueprint $table) {
            if (! Schema::hasColumn('vote_attempt_logs', 'subnet')) {
                $table->string('subnet', 64)->nullable()->after('ip_address');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'page_time_seconds')) {
                $table->unsignedInteger('page_time_seconds')->nullable()->after('language');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'mouse_move_count')) {
                $table->unsignedInteger('mouse_move_count')->nullable()->after('page_time_seconds');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'scroll_count')) {
                $table->unsignedInteger('scroll_count')->nullable()->after('mouse_move_count');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'focus_count')) {
                $table->unsignedInteger('focus_count')->nullable()->after('scroll_count');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'blur_count')) {
                $table->unsignedInteger('blur_count')->nullable()->after('focus_count');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'risk_score')) {
                $table->unsignedSmallInteger('risk_score')->nullable()->after('multi_factor_hash');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'triggered_rules')) {
                $table->json('triggered_rules')->nullable()->after('risk_score');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'vpn_detected')) {
                $table->boolean('vpn_detected')->default(false)->after('triggered_rules');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'proxy_detected')) {
                $table->boolean('proxy_detected')->default(false)->after('vpn_detected');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'hosting_detected')) {
                $table->boolean('hosting_detected')->default(false)->after('proxy_detected');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'rate_limited')) {
                $table->boolean('rate_limited')->default(false)->after('hosting_detected');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'behavior_metrics')) {
                $table->json('behavior_metrics')->nullable()->after('rate_limited');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'turnstile_verified')) {
                $table->boolean('turnstile_verified')->default(false)->after('behavior_metrics');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'turnstile_action')) {
                $table->string('turnstile_action')->nullable()->after('turnstile_verified');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'turnstile_hostname')) {
                $table->string('turnstile_hostname')->nullable()->after('turnstile_action');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'turnstile_error_codes')) {
                $table->json('turnstile_error_codes')->nullable()->after('turnstile_hostname');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'asn_name')) {
                $table->string('asn_name')->nullable()->after('turnstile_error_codes');
            }

            if (! Schema::hasColumn('vote_attempt_logs', 'asn_detected')) {
                $table->boolean('asn_detected')->default(false)->after('asn_name');
            }

            if (! Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_ip_attempted_at_index')) {
                $table->index(['ip_address', 'attempted_at'], 'vote_attempt_logs_ip_attempted_at_index');
            }

            if (! Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_subnet_attempted_at_index')) {
                $table->index(['subnet', 'attempted_at'], 'vote_attempt_logs_subnet_attempted_at_index');
            }

            if (! Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_fingerprint_attempted_at_index')) {
                $table->index(['fingerprint_js', 'attempted_at'], 'vote_attempt_logs_fingerprint_attempted_at_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vote_attempt_logs', function (Blueprint $table) {
            if (Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_fingerprint_attempted_at_index')) {
                $table->dropIndex('vote_attempt_logs_fingerprint_attempted_at_index');
            }

            if (Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_subnet_attempted_at_index')) {
                $table->dropIndex('vote_attempt_logs_subnet_attempted_at_index');
            }

            if (Schema::hasIndex('vote_attempt_logs', 'vote_attempt_logs_ip_attempted_at_index')) {
                $table->dropIndex('vote_attempt_logs_ip_attempted_at_index');
            }

            foreach (['asn_detected', 'asn_name', 'turnstile_error_codes', 'turnstile_hostname', 'turnstile_action', 'turnstile_verified', 'behavior_metrics', 'rate_limited', 'hosting_detected', 'proxy_detected', 'vpn_detected', 'triggered_rules', 'risk_score', 'blur_count', 'focus_count', 'scroll_count', 'mouse_move_count', 'page_time_seconds', 'subnet'] as $column) {
                if (Schema::hasColumn('vote_attempt_logs', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('votes', function (Blueprint $table) {
            if (Schema::hasIndex('votes', 'votes_category_multi_factor_unique')) {
                $table->dropUnique('votes_category_multi_factor_unique');
            }

            if (Schema::hasIndex('votes', 'votes_category_fingerprint_unique')) {
                $table->dropUnique('votes_category_fingerprint_unique');
            }

            if (Schema::hasIndex('votes', 'votes_category_voted_at_index')) {
                $table->dropIndex('votes_category_voted_at_index');
            }

            if (Schema::hasIndex('votes', 'votes_category_hash_voted_at_index')) {
                $table->dropIndex('votes_category_hash_voted_at_index');
            }

            foreach (['blur_count', 'focus_count', 'scroll_count', 'mouse_move_count', 'page_time_seconds'] as $column) {
                if (Schema::hasColumn('votes', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
