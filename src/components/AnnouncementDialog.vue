<template>
    <Teleport to="body">
        <Transition name="announcement-fade">
            <div v-if="visible" class="announcement-overlay" @click.self="onClose">
                <div class="announcement-panel">
                    <div class="announcement-header">
                        <div class="header-left">
                            
                            <span class="announcement-title">{{ currentAnnouncement?.title || '公告' }}</span>
                        </div>
                        <div class="header-close" @click="onClose">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                    </div>
                    <div class="announcement-content" v-if="currentAnnouncement">
                        <div class="announcement-img-wrapper">
                            <div
                                v-if="announcements.length > 1 && currentIndex > 0"
                                class="arrow-left"
                                @click.stop="prev"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </div>
                            <img
                                v-if="currentAnnouncement.imgUrl"
                                :src="currentAnnouncement.imgUrl"
                                alt="公告图片"
                                class="announcement-img"
                            />
                            <div v-if="announcements.length > 1" class="dots-bar">
                                <span
                                    v-for="(_, i) in announcements"
                                    :key="i"
                                    class="dot"
                                    :class="{ active: i === currentIndex }"
                                    @click.stop="currentIndex = i"
                                />
                            </div>
                            <div
                                v-if="announcements.length > 1 && currentIndex < announcements.length - 1"
                                class="arrow-right"
                                @click.stop="next"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </div>
                        <div v-if="currentAnnouncement.content" class="announcement-text">{{ currentAnnouncement.content }}</div>
                    </div>
                    <div class="announcement-footer">
                        <span v-if="announcements.length > 1" class="announcement-index">{{ currentIndex + 1 }} / {{ announcements.length }}</span>
                        <button class="announcement-close-btn" @click="onClose">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { announcementAPI, Announcement } from '@/apis/announcement';

const visible = ref(false);
const announcements = ref<Announcement[]>([]);
const currentIndex = ref(0);
const currentAnnouncement = computed(() => announcements.value[currentIndex.value] || null);

function prev() {
    if (currentIndex.value > 0) currentIndex.value--;
}

function next() {
    if (currentIndex.value < announcements.value.length - 1) currentIndex.value++;
}

function onClose() {
    visible.value = false;
}

async function fetchAnnouncements() {
    try {
        const res = await announcementAPI.getActiveAnnouncements();
        if (res.code === 200 && res.data && res.data.length > 0) {
            announcements.value = res.data;
            currentIndex.value = 0;
            visible.value = true;
        }
    } catch (e) {
        console.warn('获取公告失败', e);
    }
}

onMounted(() => {
    fetchAnnouncements();
});
</script>

<style lang="scss" scoped>
.announcement-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
}

.announcement-panel {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    width: 70%;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.announcement-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: linear-gradient(135deg, #f8f9fc 0%, #eef0f7 100%);

    .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header-icon {
        width: 22px;
        height: 22px;
        color: #4a6cf7;
    }

    .announcement-title {
        font-size: 16px;
        font-weight: 700;
        color: #1a1a2e;
        letter-spacing: 0.3px;
    }

    .header-close {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        color: #999;
        transition: all 0.2s;

        &:hover {
            background: rgba(0, 0, 0, 0.06);
            color: #333;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    }
}

.announcement-content {
    .announcement-img-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;

        .announcement-img {
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: contain;
            display: block;
        }

        .arrow-left,
        .arrow-right {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            color: #fff;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.25s;
            border: 1px solid rgba(255, 255, 255, 0.2);

            &:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-50%) scale(1.08);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            }

            svg {
                width: 24px;
                height: 24px;
            }
        }

        .arrow-left {
            left: 16px;
        }

        .arrow-right {
            right: 16px;
        }

        .dots-bar {
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;

            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.45);
                cursor: pointer;
                transition: all 0.25s;

                &.active {
                    background: #fff;
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
                    transform: scale(1.25);
                }

                &:hover {
                    background: rgba(255, 255, 255, 0.75);
                }
            }
        }
    }

    .announcement-text {
        line-height: 1.85;
        font-size: 15px;
        color: #444;
        white-space: pre-wrap;
        padding: 20px 24px;
        background: #fafbfd;
    }
}

.announcement-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 14px 24px;
    background: #fff;

    .announcement-index {
        font-size: 13px;
        color: #bbb;
        font-weight: 500;
    }

    .announcement-close-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 28px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s;
        box-shadow: 0 4px 14px rgba(238, 90, 90, 0.35);

        svg {
            width: 16px;
            height: 16px;
        }

        &:hover {
            background: linear-gradient(135deg, #ee5a5a 0%, #dc3d3d 100%);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(238, 90, 90, 0.45);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.announcement-fade-enter-active,
.announcement-fade-leave-active {
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    .announcement-panel {
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
}

.announcement-fade-enter-from,
.announcement-fade-leave-to {
    opacity: 0;

    .announcement-panel {
        transform: scale(0.92) translateY(20px);
        opacity: 0;
    }
}

@media (max-width: 600px) {
    .announcement-panel {
        width: 92%;
        border-radius: 12px;
    }

    .announcement-header {
        padding: 12px 16px;

        .announcement-title {
            font-size: 14px;
        }
    }

    .announcement-content .announcement-img-wrapper {
        .arrow-left,
        .arrow-right {
            width: 34px;
            height: 34px;

            svg {
                width: 18px;
                height: 18px;
            }
        }

        .arrow-left {
            left: 8px;
        }

        .arrow-right {
            right: 8px;
        }

        .dots-bar {
            bottom: 10px;
            gap: 6px;

            .dot {
                width: 6px;
                height: 6px;
            }
        }
    }

    .announcement-text {
        font-size: 13px;
        padding: 14px 16px;
    }

    .announcement-footer {
        padding: 10px 16px;
    }
}
</style>