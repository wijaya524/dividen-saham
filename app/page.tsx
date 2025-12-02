'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  BadgePercent,
  Wallet
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import stocks from '../public/stocks.png';

export default function DividendCalculator() {
  const [lot, setLot] = useState<string>('');
  const [dps, setDps] = useState<string>('');
  const [tax, setTax] = useState<boolean>(true);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const lotNum = parseFloat(lot) || 0;
  const dpsNum = parseFloat(dps) || 0;

  const totalLembar = lotNum * 100;
  const gross = totalLembar * dpsNum;
  const taxAmount = tax ? gross * 0.1 : 0;
  const net = gross - taxAmount;

  const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "e", "E", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (value: string, setter: (val: string) => void) => {
    if (value === '') {
      setter('');
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setter(value);
    }
  };

  return (
    // UBAHAN 1: Padding container menyesuaikan layar (p-4 di HP, md:p-8 di tablet/desktop)
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 md:p-8 dark:bg-zinc-950 transition-colors">

      {/* UBAHAN 2: Lebar Card lebih fleksibel */}
      <Card className="w-full max-w-[340px] sm:max-w-md md:max-w-lg shadow-xl border-zinc-200 dark:border-zinc-800">

        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="  text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
              {/* Icon size menyesuaikan */}
              <Image src={stocks} width={120}       // Minta Next.js merender gambar 120px (3x lebih tajam)
                height={120}      // Sama, 120px
                alt='stocks logo'
                className="w-10 h-10 object-contain"
              />

            </div>
            {/* Font size judul adaptif */}
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Kalkulator Dividen
            </h1>
          </div>
          <CardDescription className="text-xs md:text-sm">
            Hitung potensi cuan dividen saham kamu.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 md:space-y-6">
          {/* Input Section */}
          <div className="space-y-4">

            {/* Input Lot */}
            <div className="grid gap-2">
              <Label htmlFor="lot" className="flex items-center gap-2 text-sm md:text-base">
                <TrendingUp size={16} className="text-zinc-500" />
                Jumlah Lot
              </Label>
              <div className="relative">
                <Input
                  id="lot"
                  type="number"
                  placeholder="0"
                  value={lot}
                  onKeyDownCapture={preventMinus}
                  onChange={(e) => handleInputChange(e.target.value, setLot)}
                  // Font size input diperbesar di desktop agar lebih jelas
                  className="pl-4 pr-12 text-base md:text-lg font-medium h-10 md:h-11"
                />
                <span className="absolute right-4 top-2.5 md:top-3 text-sm text-zinc-400">Lot</span>
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 text-right">
                {formatRupiah(totalLembar).replace('Rp', '')} Lembar Saham
              </p>
            </div>

            {/* Input DPS */}
            <div className="grid gap-2">
              <Label htmlFor="dps" className="flex items-center gap-2 text-sm md:text-base">
                <Wallet size={16} className="text-zinc-500" />
                Dividen Per Lembar
              </Label>
              <Input
                id="dps"
                type="number"
                placeholder="Rp 0"
                value={dps}
                onKeyDownCapture={preventMinus}
                onChange={(e) => handleInputChange(e.target.value, setDps)}
                className="text-base md:text-lg font-medium h-10 md:h-11"
              />
            </div>

            {/* Tax Switch */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-white dark:bg-zinc-900">
              <div className="space-y-0.5">
                <Label className="text-sm md:text-base flex items-center gap-2">
                  <BadgePercent size={18} className="text-red-500" />
                  Pajak Dividen
                </Label>
                <p className="text-[10px] md:text-xs text-zinc-500">
                  Potongan PPh Final 10%
                </p>
              </div>
              <Switch
                checked={tax}
                onCheckedChange={setTax}
              />
            </div>
          </div>

          <Separator />

          {/* Result Section - Responsive Layout */}
          <div className="space-y-3 bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-zinc-500">Total Dividen (Gross)</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatRupiah(gross)}
              </span>
            </div>

            {tax && (
              <div className="flex justify-between text-xs md:text-sm text-red-500/80">
                <span>Pajak (10%)</span>
                <span>- {formatRupiah(taxAmount)}</span>
              </div>
            )}

            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700">
              {/* UBAHAN 3: Flex-col di HP, Flex-row di Desktop */}
              {/* Ini mencegah angka panjang bertabrakan dengan teks "Dividen Bersih" di layar kecil */}
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between">
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  Dividen Bersih
                </span>
                {/* Font size angka hasil membesar drastis di desktop */}
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 tracking-tight break-all">
                  {formatRupiah(net)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-[10px] md:text-xs text-zinc-400 text-center">
            *Estimasi berdasarkan data input manual
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}