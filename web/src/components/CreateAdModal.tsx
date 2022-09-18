import { Check, GameController } from 'phosphor-react';

import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Input } from './form/input';
import { useEffect, useState, FormEvent } from 'react';
import axios from "axios";

interface Game {
   id: string;
   title: string;
 }
 
export function CreateAdModal() {
   const [games, setGames] = useState<Game[]>([])
   const [weekDays, setWeekDays] = useState<string[]>([])
   const [useVoiceChannel, setUseVoiceChannel] = useState(false)

   useEffect(() => {
     axios('http://localhost:3333/games') .then(response => {
       setGames(response.data)
     })
   }, [])

   async function handleCreateAd(event: FormEvent) {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement)
      const data = Object.fromEntries(formData);

      if (!data.name) {
         return;
      }

      try {
         await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
            name: data.name,
            yearsPlaying: Number(data.yearsPlaying),
            discord: data.discord,
            weekdays: weekDays.map(Number),
            hourStart: data.hourStart,
            hourEnd: data.hourEnd,
            useVoiceChannel: useVoiceChannel
         })

        alert('Anúncio criado com sucesso!')
      } catch (err) {
         console.log(err);
         alert('Erro ao criar o anúncio!')
      }
   }

   return (
      <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed"/>
          <Dialog.Content className="fixed bg-[#2A2534] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[800px] shadow-lg shadow-black/25">
            <Dialog.Title className="text-3xl text-white font-black">Publique um anúncio</Dialog.Title>

              <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="game" className="font-semibold">Qual o game?</label>
                  <select 
                  name="game"
                  id="game" 
                  className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
                  defaultValue=""
                  >
                     <option disabled value="">Selecione o game que deseja jogar</option>

                     { games.map(game => {
                        return <option key={game.id} value={game.id}>{game.title}</option>
                     }) }

                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Seu nome (ou nickname)</label>
                  <Input  name="name" id="name" placeholder="Como te chamam dentro do game?" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="yearsPlaying">Joga ha quantos anos?</label>
                    <Input name="yearsPlaying" id="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="discord">Qual seu discord?</label>
                    <Input name="discord" id="discord" type="text" placeholder="Usuario#0000" />
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="weekDays">Quando costuma jogar?</label>

                      <ToggleGroup.Root 
                      type="multiple" 
                      className="flex gap-2"
                      value={weekDays}
                      onValueChange={setWeekDays}
                      >
                        <ToggleGroup.Item
                           value="0"
                           title="Domingo"
                           className={`${weekDays.includes('0') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           D
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="1"
                           title="Segunda"
                           className={`${weekDays.includes('1') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           S
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="2"
                           title="Terca"
                           className={`${weekDays.includes('2') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           T
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="3"
                           title="Quarta"
                           className={`${weekDays.includes('3') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           Q
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="4"
                           title="Quinta"
                           className={`${weekDays.includes('4') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           Q
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="5"
                           title="Sexta"
                           className={`${weekDays.includes('5') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           S
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                           value="6"
                           title="Sabado"
                           className={`${weekDays.includes('6') ? 'w-7 h-7 rounded bg-violet-600' : 'w-7 h-7 rounded bg-zinc-900'}`}
                           >
                           S
                        </ToggleGroup.Item>
                      </ToggleGroup.Root>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="hourStart">Qual o horario do dia?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input name="hourStart" id="hourStart" type="time" placeholder="De" />
                      <Input name="hourEnd" id="hourEnd" type="time" placeholder="Ate" />
                    </div>
                  </div>
                </div>


                <label className="mt-2 flex items-center gap-2 text-sm">
                  <Checkbox.Root 
                  checked={useVoiceChannel}
                  onCheckedChange={(checked => {
                     if (checked === true) {
                        setUseVoiceChannel(true);
                     } else {
                        setUseVoiceChannel(false);
                     }
                  })}
                  className="w-6 h-6 p-1 rounded bg-zinc-900"
                  >
                     <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-emerald-400"/>
                     </Checkbox.Indicator>
                  </Checkbox.Root>
                  Costumo me conectar no chat de voz
                </label>

                <footer className="mt-4 flex justify-end gap-4">
                  <Dialog.Close 
                  type="button" 
                  className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                  >
                    Cancelar
                  </Dialog.Close>
                  <button 
                  type="submit"
                  className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600">
                    <GameController size={24}/>
                    Encontrar duo
                  </button>
                </footer>
              </form>
          </Dialog.Content>
        </Dialog.Portal>
   );
};