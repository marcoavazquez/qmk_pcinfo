
### Install
`npm install`

### Run
`node keyboard.js`

I added a web server
`node server.js`

And it can run on terminal (clear the terminal before starting)
`node console.js`

### Before run (only for windows :()

Install [Open Hardware Monitor](https://openhardwaremonitor.org/)

Run the server: Options > Remote Web Server > Run

### For QMK

Add to _rules.mk_

` RAW_ENABLE = yes `

Add to _keymap.c_
```c
  void raw_hid_receive(uint8_t *data, uint8_t length) {

    int cpu_load_int = data[0];
    char cpu_load[3];

    itoa(cpu_load_int, cpu_load, 10);

    oled_set_cursor(0, 1);
    oled_write_P(PSTR("CPU"), true);
    oled_set_cursor(
        cpu_load_int < 10 ? 6 : (cpu_load_int < 100 ? 5 : 4),
        1
    );
    oled_write(cpu_load, false);
    oled_set_cursor(7, 1);
    oled_write_P(PSTR("%"), false);

    ...

  }
```
