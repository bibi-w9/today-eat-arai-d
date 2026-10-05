<template>
  <div class="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-pink-50 p-4 sm:min-h-[calc(100dvh-4.5rem)] sm:p-6">
    <ConfettiEffect :show="showConfetti" />
    <main
      class="relative z-10 w-full max-w-6xl rounded-[2rem] border-2 border-white bg-white/95 p-5 shadow-xl shadow-pink-200/40 backdrop-blur-sm sm:rounded-[2.5rem] sm:p-7 md:p-10 2xl:max-w-screen-2xl">
      <div class="mb-6 flex items-center justify-between">
        <button @click="router.push({ path: '/method', query: route.query })"
          class="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 sm:px-4 sm:text-base">
          <span aria-hidden="true">◂</span> กลับ
        </button>
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600 sm:px-4 sm:text-sm">สเต็ป 3/4</span>
          <NuxtLink to="/" aria-label="หน้าแรก"
            class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
            <span aria-hidden="true" class="motion-wiggle">🏠</span>
            <span class="sr-only sm:not-sr-only">หน้าแรก</span>
          </NuxtLink>
        </div>
      </div>

      <header class="mb-8 text-left">
        <h1 class="flex flex-wrap items-center gap-2 text-2xl font-extrabold leading-tight text-gray-800 sm:text-3xl"><span class="motion-bounce inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-xl" aria-hidden="true">🥕</span>เพิ่มรูปวัตถุดิบ</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">ถ่ายรูปหรือเลือกภาพจากอุปกรณ์ได้หลายรูป จากนั้นให้ระบบตรวจวัตถุดิบและแนะนำเมนูให้</p>
        <div class="mt-5 overflow-hidden rounded-2xl border border-pink-200 bg-pink-50 px-4 py-4 text-sm text-gray-700 shadow-sm sm:px-5">
          <div class="flex items-center gap-2.5">
            <span class="motion-wiggle flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm" aria-hidden="true">✨</span>
            <p class="font-extrabold text-pink-700">เคล็ดลับถ่ายรูปให้ตรวจจับได้แม่นยำขึ้น</p>
          </div>
          <ul class="mt-3 grid gap-2 sm:grid-cols-3">
            <li class="group flex items-start gap-2 rounded-xl bg-white/75 px-3 py-2.5 leading-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md">
              <span class="motion-wiggle inline-block" aria-hidden="true">🤍</span><span>ใช้พื้นหลังสีขาวหรือสีอ่อน</span>
            </li>
            <li class="group flex items-start gap-2 rounded-xl bg-white/75 px-3 py-2.5 leading-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md">
              <span class="motion-wiggle inline-block" aria-hidden="true">🥕</span><span>วางวัตถุดิบให้ห่างกันพอสมควร</span>
            </li>
            <li class="group flex items-start gap-2 rounded-xl bg-white/75 px-3 py-2.5 leading-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md">
              <span class="motion-wiggle inline-block" aria-hidden="true">☀️</span><span>เลือกบริเวณที่มีแสงพอดี ไม่มืดหรือจ้าจนเกินไป</span>
            </li>
          </ul>
        </div>
      </header>

      <div class="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <section aria-labelledby="upload-step-title" class="min-w-0 self-start rounded-3xl border border-pink-200 bg-white p-4 shadow-sm shadow-pink-100/70 sm:p-5">
          <div class="mb-4 flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-500 font-extrabold text-white shadow-sm">1</span>
            <div>
              <h2 id="upload-step-title" class="font-extrabold text-gray-800">เพิ่มรูปภาพ</h2>
              <p class="text-xs text-gray-500 sm:text-sm">ภาพชัดและมีแสงเพียงพอช่วยให้ตรวจได้ดีขึ้น</p>
            </div>
          </div>

          <div
            class="relative flex min-h-64 w-full items-center justify-center overflow-hidden rounded-[1.75rem] border-2 bg-pink-50 transition-colors"
            :class="selectedImage || isCameraOpen ? 'border-pink-200 border-solid' : 'border-pink-200 border-dashed bg-pink-50 hover:border-pink-300'">
            <template v-if="isCameraOpen">
              <div class="relative aspect-[4/3] max-h-[32rem] w-full overflow-hidden bg-black">
                <video ref="videoRef" autoplay playsinline class="absolute inset-0 h-full w-full object-cover" />
                <div class="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-3">
                  <button @click="stopCamera" class="h-10 w-10 rounded-full bg-white/90 font-bold text-gray-500 shadow-lg"
                    aria-label="ปิดกล้อง">✕</button>
                  <button @click="capturePhoto"
                    class="rounded-full bg-pink-500 px-5 py-2 font-bold text-white shadow-lg sm:px-6">📸 ถ่ายภาพ</button>
                </div>
              </div>
            </template>

            <template v-else-if="selectedImage">
              <div class="relative max-w-full" :style="previewStyle">
                <img ref="imageRef" :src="selectedImage.preview" class="absolute inset-0 h-full w-full object-contain"
                  alt="รูปวัตถุดิบ" @load="setImageSize" />
                <div v-for="(detection, index) in selectedImage.detections" :key="`${detection.label}-${index}`"
                  class="absolute rounded-md border-[3px] border-pink-500" :style="boxStyle(detection)">
                  <span class="absolute -top-7 left-0 max-w-[40vw] break-words whitespace-normal rounded-md bg-pink-500 px-2 py-1 text-xs font-bold text-white shadow">
                    {{ detection.label }} {{ detection.confidence.toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="absolute right-2 top-2 z-20 flex gap-2 sm:right-3 sm:top-3">
                <button @click="startCamera" class="rounded-lg bg-white px-2.5 py-2 text-xs font-bold text-pink-600 shadow sm:px-3 sm:text-sm">📸 ถ่ายเพิ่ม</button>
                <label class="cursor-pointer rounded-lg bg-white px-2.5 py-2 text-xs font-bold text-blue-600 shadow sm:px-3 sm:text-sm">🖼️ เพิ่มรูป
                  <input type="file" accept="image/*" multiple class="hidden" @change="handleFileChange" />
                </label>
              </div>
            </template>

            <div v-else class="p-6 text-center">
              <span class="mb-3 block text-5xl" aria-hidden="true">🧺</span>
              <p class="font-bold text-gray-700">ยังไม่มีรูปวัตถุดิบ</p>
              <p class="mt-1 text-sm text-gray-500">เริ่มจากถ่ายรูปหรือเลือกภาพจากอุปกรณ์</p>
            </div>
          </div>
          <canvas ref="canvasRef" class="hidden" />

          <div v-if="images.length" class="mt-4">
            <div class="mb-2 flex items-center justify-between px-1">
              <p class="text-sm font-bold text-gray-600">รูปที่เลือก {{ images.length }} รูป</p>
              <button @click="clearImages" class="text-xs font-bold text-pink-600 hover:text-pink-700 sm:text-sm">ลบทั้งหมด</button>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-2" aria-label="รูปที่เลือก">
              <div v-for="(image, index) in images" :key="image.id" class="relative shrink-0">
                <button @click="selectImage(index)" class="h-16 w-16 overflow-hidden rounded-xl border-[3px] bg-pink-50 sm:h-20 sm:w-20"
                  :class="selectedIndex === index ? 'border-pink-500' : 'border-pink-100'"
                  :aria-label="`แสดงรูปที่ ${index + 1}`" :aria-pressed="selectedIndex === index">
                  <img :src="image.preview" class="h-full w-full object-cover" :alt="`รูปที่ ${index + 1}`" />
                </button>
                <button @click="removeImage(index)" class="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-gray-700 text-xs text-white shadow"
                  :aria-label="`ลบรูปที่ ${index + 1}`">✕</button>
                <span class="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 text-[10px] font-bold text-pink-600">{{ index + 1 }}</span>
              </div>
            </div>
          </div>

          <div v-if="!isCameraOpen && !images.length" class="mt-4 grid grid-cols-2 gap-3">
            <button @click="startCamera" class="rounded-2xl bg-pink-500 px-3 py-3 font-bold text-white shadow-[0_4px_0_0_#9d174d] transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 sm:py-3.5">
              📸 {{ images.length ? 'ถ่ายเพิ่ม' : 'ถ่ายรูป' }}
            </button>
            <label class="cursor-pointer rounded-2xl border-2 border-pink-200 bg-white px-3 py-3 text-center font-bold text-pink-600 shadow-[0_4px_0_0_#fbcfe8] transition hover:bg-pink-50 focus-within:ring-4 focus-within:ring-pink-200 sm:py-3.5">
              🖼️ {{ images.length ? 'เพิ่มรูป' : 'เลือกรูป' }}
              <input type="file" accept="image/*" multiple class="sr-only" @change="handleFileChange" />
            </label>
          </div>

          <button v-if="images.length && !hasDetected" @click="analyzeImages" :disabled="isDetecting"
            class="mt-4 w-full rounded-2xl bg-pink-500 px-5 py-3.5 font-extrabold text-white shadow-[0_4px_0_0_#be185d] transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 disabled:cursor-wait disabled:opacity-60 sm:py-4">
            <span aria-hidden="true">{{ isDetecting ? '🔎' : '✨' }}</span>
            {{ isDetecting ? `กำลังตรวจรูป ${detectingProgress}/${images.length}...` : `ตรวจวัตถุดิบ ${images.length} รูป` }}
          </button>
        </section>

        <div class="grid min-w-0 items-start gap-5 2xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section aria-labelledby="results-step-title" aria-live="polite" class="min-w-0 self-start rounded-3xl border border-pink-200 bg-pink-50/70 p-4 shadow-sm shadow-pink-100/70 sm:p-5">
          <div class="mb-4 flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white font-extrabold text-pink-600 shadow-sm">2</span>
            <div>
              <h2 id="results-step-title" class="font-extrabold text-gray-800">ตรวจวัตถุดิบและหาเมนู</h2>
              <p class="text-xs text-gray-500 sm:text-sm">ผลตรวจจะแสดงในส่วนนี้</p>
            </div>
          </div>

          <div v-if="isDetecting" class="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-6 text-center" role="status" aria-live="polite">
            <span class="motion-pulse mb-3 text-4xl" aria-hidden="true">🔎</span>
            <p class="font-bold text-gray-800">กำลังตรวจวัตถุดิบ</p>
            <p class="mt-2 text-sm text-gray-500">กำลังประมวลผลรูป {{ detectingProgress }} จาก {{ images.length }}</p>
            <div class="mt-5 w-full max-w-sm animate-pulse space-y-3" aria-hidden="true">
              <div class="h-3 w-2/3 rounded-full bg-pink-100"></div>
              <div class="flex flex-wrap gap-2"><div class="h-7 w-24 rounded-full bg-pink-100"></div><div class="h-7 w-28 rounded-full bg-pink-50"></div><div class="h-7 w-20 rounded-full bg-pink-100"></div></div>
            </div>
            <div class="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-pink-100">
              <div class="h-full rounded-full bg-pink-500 transition-all" :style="{ width: `${(detectingProgress / images.length) * 100}%` }"></div>
            </div>
          </div>
          <template v-else-if="hasDetected">
            <div class="rounded-2xl border border-pink-100 bg-white/90 p-4 shadow-sm sm:p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="font-extrabold text-gray-800"><span class="mr-1" aria-hidden="true">🎉</span>พบวัตถุดิบ {{ allDetections.length }} รายการ</p>
                <span class="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">{{ images.length }} รูป</span>
              </div>
              <p class="mt-1 text-sm text-gray-500">แยกผลตรวจตามภาพที่เลือก</p>
              <div v-if="!allDetections.length" class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4" role="status">
                <p class="font-bold text-amber-900">ยังตรวจไม่พบวัตถุดิบ</p>
                <p class="mt-1 text-sm leading-6 text-amber-800">ลองตรวจซ้ำ หรือเลือกรูปที่สว่างและเห็นวัตถุดิบชัดเจน</p>
                <div class="mt-4 grid grid-cols-2 gap-2">
                  <button @click="analyzeImages" :disabled="isDetecting"
                    class="rounded-xl bg-amber-700 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-amber-800 disabled:opacity-60">ลองตรวจอีกครั้ง</button>
                  <label class="cursor-pointer rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-center text-sm font-bold text-amber-900 transition hover:bg-amber-100">
                    เปลี่ยนรูป
                    <input type="file" accept="image/*" multiple class="sr-only" @change="replaceImages" />
                  </label>
                </div>
              </div>
              <div v-else class="mt-4">
                <p class="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500"><span class="motion-bounce" aria-hidden="true">👆</span>แตะรูปเพื่อดูวัตถุดิบที่ตรวจพบ</p>
                <div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3" aria-label="เลือกรูปเพื่อดูผลตรวจ">
                  <button v-for="group in detectionGroups" :key="group.imageIndex" type="button"
                    @click="resultImageIndex = group.imageIndex"
                    class="group flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-2xl border-2 p-2 text-center transition duration-200 hover:-translate-y-1 hover:rotate-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 active:translate-y-0 sm:w-28"
                    :class="resultImageIndex === group.imageIndex ? 'border-pink-400 bg-pink-50 shadow-md shadow-pink-100' : 'border-white bg-white shadow-sm hover:border-pink-200'"
                    :aria-pressed="resultImageIndex === group.imageIndex" :aria-label="`ดูผลตรวจรูปที่ ${group.imageIndex + 1}`">
                    <span class="relative block h-14 w-full overflow-hidden rounded-xl bg-pink-100 ring-2 ring-white sm:h-16">
                      <img :src="group.image.preview" class="h-full w-full object-cover transition duration-300 group-hover:scale-110" :alt="`ภาพวัตถุดิบที่ ${group.imageIndex + 1}`" />
                      <span class="absolute right-1 top-1 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-extrabold text-pink-700 shadow-sm">
                        {{ group.detections.length }} รายการ
                      </span>
                    </span>
                    <span class="flex items-center gap-1 text-xs font-extrabold text-gray-700"><span class="motion-wiggle" aria-hidden="true">📸</span>ภาพที่ {{ group.imageIndex + 1 }}</span>
                  </button>
                </div>
                <div v-if="activeDetectionGroup" class="rounded-2xl border border-pink-100 bg-pink-50 p-3 shadow-sm sm:p-4">
                  <div class="mb-3 flex items-center gap-2">
                    <span class="motion-bounce flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-lg" aria-hidden="true">🥗</span>
                    <p class="font-extrabold text-gray-800">วัตถุดิบในภาพที่ {{ activeDetectionGroup.imageIndex + 1 }}</p>
                    <span class="ml-auto rounded-full bg-white px-2.5 py-1 text-xs font-bold text-pink-600 shadow-sm">{{ activeDetectionGroup.detections.length }} อย่าง ✨</span>
                  </div>
                  <div v-if="activeDetectionGroup.detections.length" class="grid gap-2 sm:grid-cols-2">
                    <div v-for="(detection, index) in activeDetectionGroup.detections" :key="`${activeDetectionGroup.imageIndex}-${index}`"
                      class="group flex min-w-0 items-start justify-between gap-3 rounded-xl border border-pink-100 bg-white px-3 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md">
                      <span class="flex min-w-0 items-start gap-2 text-base font-extrabold leading-6 text-pink-800">
                        <span class="motion-wiggle mt-1 text-sm text-pink-400" aria-hidden="true">✿</span>
                        <span class="whitespace-normal break-words">{{ detection.label }}</span>
                      </span>
                      <span class="shrink-0 rounded-full bg-pink-100 px-2 py-1 text-xs font-extrabold text-pink-700">
                        {{ detection.confidence.toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                  <p v-else class="rounded-xl bg-white/80 px-3 py-3 text-sm leading-6 text-gray-600">ยังไม่พบวัตถุดิบในภาพนี้ ลองเลือกภาพอื่นหรือถ่ายใหม่ให้เห็นวัตถุดิบชัดขึ้นนะ</p>
                </div>
              </div>
            </div>
            <button v-if="allDetections.length" @click="findMenus" :disabled="isMatching"
              class="mt-4 w-full rounded-2xl bg-pink-500 px-5 py-3.5 font-bold text-white shadow-[0_4px_0_0_#9d174d] transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 disabled:cursor-wait disabled:opacity-60 sm:py-4">
              {{ isMatching ? 'กำลังค้นหาเมนู...' : 'ค้นหาเมนูจากวัตถุดิบ 🍽️' }}
            </button>
          </template>
          <div v-else class="flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-white/70 p-6 text-center sm:min-h-64">
            <span class="mb-3 text-5xl" aria-hidden="true">🧾</span>
            <p class="font-bold text-gray-700">{{ images.length ? 'พร้อมตรวจวัตถุดิบแล้ว' : 'รอรูปวัตถุดิบ' }}</p>
            <p class="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {{ images.length ? 'กดปุ่ม “ตรวจวัตถุดิบ” เพื่อดูรายการวัตถุดิบที่พบ' : 'เมื่อเพิ่มรูปแล้ว ผลการตรวจสอบจะแสดงตรงนี้' }}
            </p>
          </div>

        </section>

        <aside class="grid min-w-0 content-start gap-4 2xl:pt-1" aria-label="คำแนะนำการตรวจวัตถุดิบ">
          <div class="rounded-2xl border border-pink-200 bg-pink-50 p-4 text-gray-700 shadow-sm sm:p-5">
            <div class="flex items-center gap-2.5">
              <span class="motion-wiggle flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm" aria-hidden="true">🪄</span>
              <p class="font-extrabold text-orange-700">รูปยังตรวจไม่ตรงใจ? ลองปรับอีกนิด!</p>
            </div>
            <p class="mt-2 text-sm leading-6 text-gray-600">ถ้าระบบตรวจไม่พบหรือระบุวัตถุดิบคลาดเคลื่อน ลองทำตามนี้ดูนะ</p>
            <ol class="mt-3 grid gap-2">
              <li class="flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span class="motion-bounce flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-extrabold text-pink-600">1</span>
                <span class="text-sm leading-5">ถ่ายให้ใกล้ขึ้นและภาพคมชัด</span>
              </li>
              <li class="flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span class="motion-bounce flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-extrabold text-pink-600">2</span>
                <span class="text-sm leading-5">ถ่ายวัตถุดิบทีละอย่าง</span>
              </li>
              <li class="flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span class="motion-bounce flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-extrabold text-pink-600">3</span>
                <span class="text-sm leading-5">หลีกเลี่ยงเงาและสิ่งของอื่นที่บังภาพ</span>
              </li>
            </ol>
          </div>

          <div class="rounded-2xl border border-pink-200 bg-pink-50 p-4 shadow-sm sm:p-5" aria-label="คลาสวัตถุดิบที่โมเดลตรวจจับได้">
            <div class="flex items-center gap-2">
              <span class="motion-bounce flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm" aria-hidden="true">🧺</span>
              <h3 class="text-sm font-extrabold text-pink-700">วัตถุดิบที่ระบบรู้จัก</h3>
            </div>
            <p class="mt-2 text-xs leading-5 text-gray-600">เลือกรูปที่มีวัตถุดิบเหล่านี้ เพื่อให้ระบบช่วยตรวจหาได้เลย</p>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li v-for="ingredient in detectableIngredients" :key="ingredient"
                class="rounded-full border border-pink-200 bg-white px-2.5 py-1 text-xs font-bold text-pink-700 shadow-sm sm:text-sm">
                {{ ingredient }}
              </li>
            </ul>
          </div>
        </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Detection = { label: string; confidence: number; box: { x: number; y: number; width: number; height: number } }
type ImageItem = { id: string; file: File; preview: string; detections: Detection[] }

const router = useRouter()
const route = useRoute()
const { notify } = useAppToast()
const showConfetti = ref(false)
let confettiTimeout: ReturnType<typeof setTimeout> | undefined
const celebrate = () => {
  showConfetti.value = false
  requestAnimationFrame(() => { showConfetti.value = true })
  if (confettiTimeout) clearTimeout(confettiTimeout)
  confettiTimeout = setTimeout(() => { showConfetti.value = false; confettiTimeout = undefined }, 1500)
}
const selectedCategory = String(route.query.category || '')
const selectedMethod = String(route.query.method || '')
const detectableIngredients = [
  'เห็ดออริจิ', 'แครอท', 'ไก่', 'ไข่', 'บะหมี่กึ่งสำเร็จรูป', 'หอมใหญ่',
  'หมู', 'ข้าว', 'กุ้ง', 'กะเพรา', 'มะเขือเทศ', 'ผักบุ้ง'
]
const images = ref<ImageItem[]>([])
const selectedIndex = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageSize = ref({ width: 1, height: 1 })
const isCameraOpen = ref(false)
const isDetecting = ref(false)
const detectingProgress = ref(0)
const isMatching = ref(false)
const hasDetected = ref(false)
const resultImageIndex = ref(0)
const matchedRecipesState = useState<any[]>('matchedRecipes', () => [])
let videoStream: MediaStream | null = null

const selectedImage = computed(() => images.value[selectedIndex.value] || null)
const allDetections = computed(() => images.value.flatMap((image, imageIndex) => image.detections.map(detection => ({ ...detection, imageIndex }))))
const detectionGroups = computed(() => images.value
  .map((image, imageIndex) => ({ image, imageIndex, detections: image.detections })))
const activeDetectionGroup = computed(() => detectionGroups.value[resultImageIndex.value] || detectionGroups.value[0] || null)
const previewStyle = computed(() => {
  const ratio = imageSize.value.width / imageSize.value.height
  return { width: `min(100%, calc(32rem * ${ratio}))`, aspectRatio: `${imageSize.value.width} / ${imageSize.value.height}` }
})
const boxStyle = (d: Detection) => ({ left: `${(d.box.x / imageSize.value.width) * 100}%`, top: `${(d.box.y / imageSize.value.height) * 100}%`, width: `${(d.box.width / imageSize.value.width) * 100}%`, height: `${(d.box.height / imageSize.value.height) * 100}%` })

const resetDetection = () => { hasDetected.value = false; images.value.forEach(image => { image.detections = [] }) }
const setImageSize = () => { if (imageRef.value) imageSize.value = { width: imageRef.value.naturalWidth, height: imageRef.value.naturalHeight } }
const selectImage = async (index: number) => { selectedIndex.value = index; await nextTick(); setImageSize() }
const normalizeImageFile = async (file: File) => {
  // Camera images can contain EXIF orientation instead of storing the
  // pixels in their displayed orientation. Normalize them once so that the
  // preview, detector, and detection boxes all use the same coordinate space.
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const context = canvas.getContext('2d')
    if (!context) return file

    context.drawImage(bitmap, 0, 0)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
    if (!blob) return file

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified })
  } catch {
    // Keep the original file as a fallback for browsers that do not support
    // EXIF-aware ImageBitmap creation.
    return file
  }
}

const addFiles = async (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (!imageFiles.length) return
  resetDetection()
  const normalizedFiles = await Promise.all(imageFiles.map(normalizeImageFile))
  images.value.push(...normalizedFiles.map(file => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, preview: URL.createObjectURL(file), detections: [] })))
  selectedIndex.value = images.value.length - 1
}
const removeImage = (index: number) => {
  const [removed] = images.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.preview)
  selectedIndex.value = Math.max(0, Math.min(selectedIndex.value, images.value.length - 1))
  resetDetection()
}
const clearImages = () => { images.value.forEach(image => URL.revokeObjectURL(image.preview)); images.value = []; selectedIndex.value = 0; hasDetected.value = false }
const replaceImages = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || []).filter(file => file.type.startsWith('image/'))
  if (!files.length) return
  clearImages()
  void addFiles(files)
  input.value = ''
}

const startCamera = async () => {
  resetDetection(); isCameraOpen.value = true
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, aspectRatio: { ideal: 4 / 3 } } })
    await nextTick()
    if (videoRef.value) videoRef.value.srcObject = videoStream
  } catch { notify('เปิดกล้องไม่ได้ ลองอนุญาตการใช้งานกล้องหรืออัปโหลดรูปแทนนะ', 'error'); isCameraOpen.value = false }
}
const stopCamera = () => { videoStream?.getTracks().forEach(track => track.stop()); videoStream = null; isCameraOpen.value = false }
const capturePhoto = () => {
  const video = videoRef.value; const canvas = canvasRef.value
  if (!video || !canvas || !video.videoWidth || !video.videoHeight) return
  const targetRatio = 4 / 3; const sourceRatio = video.videoWidth / video.videoHeight
  const sourceWidth = sourceRatio > targetRatio ? video.videoHeight * targetRatio : video.videoWidth
  const sourceHeight = sourceRatio > targetRatio ? video.videoHeight : video.videoWidth / targetRatio
  const sourceX = (video.videoWidth - sourceWidth) / 2; const sourceY = (video.videoHeight - sourceHeight) / 2
  canvas.width = 1600; canvas.height = 1200
  canvas.getContext('2d')?.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)
  canvas.toBlob(async blob => {
    if (!blob) return
    await addFiles([new File([blob], `captured-ingredients-${Date.now()}.jpg`, { type: 'image/jpeg' })])
    await selectImage(images.value.length - 1)
  }, 'image/jpeg', 0.92)
}
const handleFileChange = (event: Event) => { const input = event.target as HTMLInputElement; void addFiles(Array.from(input.files || [])); input.value = '' }
const analyzeImages = async () => {
  if (!images.value.length) return
  isDetecting.value = true; detectingProgress.value = 0
  try {
    for (const [index, image] of images.value.entries()) {
      detectingProgress.value = index + 1
      const form = new FormData(); form.append('image', image.file)
      const response = await $fetch<{ success: boolean; detections: Detection[] }>('/api/detect', { method: 'POST', body: form })
      image.detections = response.detections
    }
    hasDetected.value = true
    if (allDetections.value.length) celebrate()
  } catch (error: any) { notify(error?.data?.message || 'ตรวจสอบรูปไม่สำเร็จ ลองอีกครั้งนะ', 'error') } finally { isDetecting.value = false }
}
const findMenus = async () => {
  isMatching.value = true
  try {
    const mappedIngredients = [...new Set(allDetections.value.flatMap(item => item.label === 'บะหมี่กึ่งสำเร็จรูป' ? ['บะหมี่กึ่งสำเร็จรูป', 'มาม่า'] : [item.label]))]
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/recipes/match', { method: 'POST', body: { category: selectedCategory, method: selectedMethod, ingredients: mappedIngredients } })
    if (response.success && response.data.length) {
      matchedRecipesState.value = response.data
      await router.push({ path: '/result', query: route.query })
    } else notify('ยังไม่พบเมนูที่ตรงกับวัตถุดิบและตัวเลือกนี้ ลองเปลี่ยนวิธีทำหรือถ่ายรูปเพิ่มนะ', 'info')
  } catch { notify('ค้นหาเมนูไม่สำเร็จ ลองอีกครั้งนะ', 'error') } finally { isMatching.value = false }
}
onBeforeUnmount(() => {
  stopCamera()
  images.value.forEach(image => URL.revokeObjectURL(image.preview))
  if (confettiTimeout) clearTimeout(confettiTimeout)
})
</script>
