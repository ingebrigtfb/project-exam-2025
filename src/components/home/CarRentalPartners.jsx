import carIcon from '../../assets/car.png';
import hertzLogo from '../../assets/Hertz.png';
import avisLogo from '../../assets/avis.png';
import sixtLogo from '../../assets/sixt.png';

const CarRentalPartners = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-16">
      <div className="flex flex-col items-center">
        {/* Desktop layout */}
        <div className="hidden md:flex w-full">
          <div className="flex flex-row items-start w-full">
            {/* Car icon column */}
            <div className="w-1/4 flex justify-center">
              <img 
                src={carIcon} 
                alt="Car icon" 
                className="w-70"
              />
            </div>
            
            {/* Text and logos column */}
            <div className="w-3/4 flex flex-col items-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-12">
                Start your journey with the perfect ride
              </h2>
              
              {/* Car rental company logos */}
              <div className="flex justify-center items-center gap-12 pr-12">
                <a 
                  href="https://www.hertz.no/rentacar/reservation/?gad_source=1&gad_campaignid=125499550&gbraid=0AAAAADqnBBrHB9N9albHLMaowam6tNGLL&gclid=Cj0KCQjwucDBBhDxARIsANqFdr0n4Vh6hiciVJbO0zT6hmrbALbDH1WsktXtd1BkvbZxxVb9bcmr9BAaAqMaEALw_wcB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={hertzLogo} 
                    alt="Hertz" 
                    className="h-15 object-contain"
                  />
                </a>
                <a 
                  href="https://www.avis.no/?cid=pp_site-GOOGLE_camp-1783417424_adgroup-70901550122_target-kwd-13402896_creative-561031080143_device-c_feed-&gad_source=1&gad_campaignid=1783417424&gbraid=0AAAAADEVRUINZcijF9SeIdt0BWlyuZq6x&gclid=Cj0KCQjwucDBBhDxARIsANqFdr3LUYA8b7n2lzA5332psR1EhnxLhU7h3JURtMYm7O4gx6dpHirv2-gaAs5oEALw_wcB&gclsrc=aw.ds" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={avisLogo} 
                    alt="Avis" 
                    className="h-15 object-contain"
                  />
                </a>
                <a 
                  href="https://www.sixt.no/?gad_source=1&gad_campaignid=77984855&gbraid=0AAAAAD98fIXKQc25Aga5jo9OK3J4qHxS4&gclid=Cj0KCQjwucDBBhDxARIsANqFdr3RnaF2yZTThvGwDxYoRcTaafbG8xh7jECdKN2_Hw7uk5H3vWiQv_saAkAgEALw_wcB#/?sxamc=Google|Search&fir=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={sixtLogo} 
                    alt="Sixt" 
                    className="h-15 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="flex flex-col items-center md:hidden w-full">
          <h2 className="text-2xl font-bold text-center mb-10">
            Start your journey with the perfect ride
          </h2>
          
          {/* Car rental company logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 w-full">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={hertzLogo} 
                alt="Hertz" 
                className="h-10 object-contain"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={avisLogo} 
                alt="Avis" 
                className="h-10 object-contain"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={sixtLogo} 
                alt="Sixt" 
                className="h-10 object-contain"
              />
            </a>
          </div>
        </div>
        
        {/* Horizontal divider line at bottom */}
        <div className="w-full h-px bg-gray-300 mt-12"></div>
      </div>
    </div>
  );
};

export default CarRentalPartners; 